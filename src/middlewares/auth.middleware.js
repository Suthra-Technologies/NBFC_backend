const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const User = require("../modules/users/user.model");
const Bank = require("../modules/bank/bank.model");
const { getTenantConnection } = require("../utils/tenantConnection");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);

    let user = null;

    // If JWT has a bankId, user belongs to a tenant DB — look them up there
    if (decoded.bankId) {
      const bank = await Bank.findById(decoded.bankId);
      if (bank && bank.dbName) {
        console.log(`[Auth] Resolving user ${decoded.userId} on tenant ${bank.dbName}`);
        const connection = await getTenantConnection(bank.dbName);
        const TenantUser = connection.model("User");
        user = await TenantUser.findById(decoded.userId)
          .populate("roleId");

        if (user) {
          console.log(`[Auth] User found in tenant DB: ${user.email}, roleId: ${user.roleId?._id}`);
        } else {
          console.log(`[Auth] User NOT found in tenant DB.`);
        }
      }
    }

    // Fallback: look in main DB (for SUPER_ADMIN)
    if (!user) {
      console.log(`[Auth] Falling back to main DB for user ${decoded.userId}`);
      user = await User.findById(decoded.userId)
        .populate("roleId");
    }

    if (!user || !user.isActive) {
      console.log(`[Auth] Auth Failed: user is ${!user ? 'null' : 'inactive'}`);
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    req.user = {
      id: user._id,
      userId: user.userId,
      bankId: decoded.bankId || (req.tenant ? req.tenant._id.toString() : null),
      branchId: decoded.branchId || req.get("x-branch-id"),
      role: user.roleId?.code || 'USER',
      permissions: user.roleId?.permissions || [],
    };

    console.log(`[Auth] Success: ${user.email} (${req.user.role})`);

    // If tenant user, attach their models for downstream use
    if (decoded.bankId && !req.models) {
      const bank = await Bank.findById(decoded.bankId);
      if (bank && bank.dbName) {
        const connection = await getTenantConnection(bank.dbName);
        req.models = {
          User: connection.model("User"),
          Role: connection.model("Role"),
          Branch: connection.model("Branch"),
          Customer: connection.model("Customer"),
          Loan: connection.model("Loan"),
          Member: connection.model("Member"),
        };
      }
    }

    next();
  } catch (error) {
    console.error("[Auth] Exception:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token or session error" });
  }
};