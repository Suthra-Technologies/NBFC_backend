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
        const connection = await getTenantConnection(bank.dbName);
        const TenantUser = connection.model("User");
        user = await TenantUser.findById(decoded.userId)
          .populate("roleId")
          .populate("bankId");
      }
    }

    // Fallback: look in main DB (for SUPER_ADMIN)
    if (!user) {
      user = await User.findById(decoded.userId)
        .populate("roleId")
        .populate("bankId");
    }

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    req.user = {
      id: user._id,
      userId: user.userId,
      bankId: decoded.bankId,
      branchId: decoded.branchId,
      role: user.roleId.code,
      permissions: user.roleId.permissions || [],
    };

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
        };
      }
    }


    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};