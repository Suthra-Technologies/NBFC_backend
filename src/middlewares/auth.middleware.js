const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const User = require("../modules/users/user.model");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.userId)
      .populate("roleId")
      .populate("bankId");

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

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};