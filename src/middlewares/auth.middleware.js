const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const User = require("../modules/users/user.model");
const Role = require("../modules/roles/role.model");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Fetch user and populate role
    const user = await User.findById(decoded.id || decoded._id).populate("roleId");

    if (!user || !user.isActive || user.isDeleted) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    // Attach user object with populated role to request
    // Transform role object for easier access
    req.user = {
      _id: user._id,
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      bankId: user.bankId,
      branchId: user.branchId,
      role: user.roleId ? user.roleId.code : null, // Role code like "BANK_ADMIN"
      permissions: user.roleId ? user.roleId.permissions : [],
    };

    // Also attach the full user document if needed elsewhere, 
    // but try to use the simplified object above for standard checks.
    req.userDoc = user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};