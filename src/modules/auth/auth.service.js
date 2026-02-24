const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const Bank = require("../bank/bank.model");
const { jwtSecret, jwtExpires } = require("../../config/env");
const { getTenantConnection } = require("../../utils/tenantConnection");

/**
 * Login handler supporting both:
 *   - SUPER_ADMIN (main DB)
 *   - BANK_ADMIN and other bank users (tenant DB, resolved by email -> bank lookup)
 */
exports.login = async (email, password, tenant = null, models = null) => {

  let user = null;
  let userBankId = null;

  // ── 1. Try to find user in main DB first (Super Admin lives here) ────────────
  const mainUser = await User.findOne({ email, isDeleted: false })
    .populate("roleId")
    .populate("bankId");

  if (mainUser && mainUser.roleId && mainUser.roleId.code === "SUPER_ADMIN") {
    user = mainUser;
  } else if (!mainUser) {
    // ── 2. Not in main DB — scan tenant DBs ─────────────────────────────────
    //    If tenant middleware provided models, use them (subdomain login)
    if (models && models.User) {
      const tenantUser = await models.User.findOne({ email, isDeleted: false })
        .populate("roleId")
        .populate("bankId");
      if (tenantUser) {
        user = tenantUser;
        userBankId = tenant ? tenant._id : tenantUser.bankId?._id;
      }
    } else {
      // No subdomain — scan all banks to find this email
      const allBanks = await Bank.find({ isDeleted: false, dbName: { $ne: null } });
      for (const bank of allBanks) {
        try {
          const conn = await getTenantConnection(bank.dbName);
          const TenantUser = conn.model("User");
          const foundUser = await TenantUser.findOne({ email, isDeleted: false })
            .populate("roleId")
            .populate("bankId");
          if (foundUser) {
            user = foundUser;
            userBankId = bank._id;
            break;
          }
        } catch (_) {
          // Connection failed for this bank, skip
        }
      }
    }
  } else {
    // mainUser exists but they are NOT super admin — it's a legacy non-tenant user
    user = mainUser;
    userBankId = mainUser.bankId?._id;
  }

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  // ── 3. Verify password ──────────────────────────────────────────────────────
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const roleCode = user.roleId.code;

  // ── 4. Tenant validation ────────────────────────────────────────────────────
  if (roleCode === "SUPER_ADMIN") {
    if (tenant) {
      throw new Error("Super Admin should login through the main portal");
    }
  } else {
    const resolvedBank = userBankId
      ? await Bank.findById(userBankId)
      : user.bankId;

    if (!resolvedBank) {
      throw new Error("Bank not found");
    }
    if (resolvedBank.status !== "ACTIVE") {
      throw new Error("Bank account is suspended");
    }
    if (tenant && resolvedBank._id.toString() !== tenant._id.toString()) {
      throw new Error("You do not have access to this bank's portal");
    }
    userBankId = resolvedBank._id;
  }

  // ── 5. Issue JWT ────────────────────────────────────────────────────────────
  const token = jwt.sign(
    {
      userId: user._id,
      bankId: userBankId || null,
      branchId: user.branchId || null,
      role: roleCode,
    },
    jwtSecret,
    { expiresIn: jwtExpires }
  );

  const bankData = userBankId ? await Bank.findById(userBankId) : null;

  return {
    token,
    user: {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: roleCode,
      bankId: userBankId || null,
      bankName: bankData?.name || null,
      branchId: user.branchId || null,
      isSuperAdmin: roleCode === "SUPER_ADMIN",
    },
    permissions: user.roleId.permissions || [],
  };
};