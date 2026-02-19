const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const Role = require("../roles/role.model");
const Bank = require("../bank/bank.model");
const { jwtSecret, jwtExpires } = require("../../config/env");


exports.login = async (email, password, tenant = null) => {
  const user = await User.findOne({ email, isDeleted: false })
    .populate("roleId")
    .populate("bankId");

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Handle Tenant Validation
  if (user.roleId.code !== "SUPER_ADMIN") {
    // If accessed via a subdomain (tenant is provided)
    if (tenant) {
      if (!user.bankId || user.bankId._id.toString() !== tenant._id.toString()) {
        throw new Error("You do not have access to this bank's portal");
      }
    } else {
      // If no subdomain, but user is not SUPER_ADMIN, they MUST have a bank
      // AND we might want to force them to use their subdomain if it exists
      if (!user.bankId) {
        throw new Error("User not assigned to any bank");
      }
    }

    if (user.bankId.status !== "ACTIVE") {
      throw new Error("Bank is suspended");
    }
  } else {
    // SUPER_ADMIN logging in
    if (tenant) {
      throw new Error("Super Admin should login through the main portal");
    }
  }

  let bankId = user.bankId ? user.bankId._id : null;

  const token = jwt.sign(
    {
      userId: user._id,
      bankId: bankId,
      branchId: user.branchId || null,
      role: user.roleId.code,
    },
    jwtSecret,
    { expiresIn: jwtExpires }
  );

  return {
    token,
    user: {
      userId: user.userId,
      fullName: user.fullName,
      role: user.roleId.code,
      bankId: bankId,
    },
  };
};