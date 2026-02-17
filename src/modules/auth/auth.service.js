const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const Role = require("../roles/role.model");
const Bank = require("../bank/bank.model");
const { jwtSecret, jwtExpires } = require("../../config/env");


exports.login = async (email, password) => {
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

  // 🔥 SUPER_ADMIN bypass (no bank required)
  let bankId = null;

  if (user.roleId.code !== "SUPER_ADMIN") {
    if (!user.bankId) {
      throw new Error("User not assigned to any bank");
    }

    if (user.bankId.status !== "ACTIVE") {
      throw new Error("Bank is suspended");
    }

    bankId = user.bankId._id;
  }

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