const User = require("./user.model");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

exports.createUser = async (data, creatorBankId = null) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    userId: "USR-" + randomUUID().slice(0, 8),
    bankId: creatorBankId || data.bankId,
    branchId: data.branchId || null,
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    passwordHash: hashedPassword,
    roleId: data.roleId,
    isActive: data.isActive !== undefined ? data.isActive : true,
  });

  return user;
};

exports.getAllUsers = async (query = {}) => {
  return await User.find({ ...query, isDeleted: false })
    .populate("roleId", "name code")
    .populate("bankId", "name")
    .populate("branchId", "name");
};

exports.getUserById = async (id, bankId = null) => {
  const query = { _id: id, isDeleted: false };
  if (bankId) query.bankId = bankId;
  return await User.findOne(query).populate("roleId bankId branchId");
};

exports.updateUser = async (id, data, bankId = null) => {
  const query = { _id: id, isDeleted: false };
  if (bankId) query.bankId = bankId;

  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  return await User.findOneAndUpdate(query, data, { new: true });
};

exports.deleteUser = async (id, bankId = null) => {
  const query = { _id: id };
  if (bankId) query.bankId = bankId;

  return await User.findOneAndUpdate(query, { isDeleted: true }, { new: true });
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email, isDeleted: false }).populate("roleId");
};