const User = require("./user.model");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

exports.createUser = async (data, creatorBankId = null, models = null) => {
  const UserModel = models && models.User ? models.User : User;
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await UserModel.create({
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

exports.getAllUsers = async (query = {}, models = null) => {
  const UserModel = models && models.User ? models.User : User;
  return await UserModel.find({ ...query, isDeleted: false })
    .populate("roleId", "name code")
    .populate("bankId", "name")
    .populate("branchId", "name");
};

exports.getUserById = async (id, bankId = null, models = null) => {
  const UserModel = models && models.User ? models.User : User;
  const query = { _id: id, isDeleted: false };
  if (bankId) query.bankId = bankId;
  return await UserModel.findOne(query).populate("roleId bankId branchId");
};

exports.updateUser = async (id, data, bankId = null, models = null) => {
  const UserModel = models && models.User ? models.User : User;
  const query = { _id: id, isDeleted: false };
  if (bankId) query.bankId = bankId;

  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  return await UserModel.findOneAndUpdate(query, data, { new: true });
};

exports.deleteUser = async (id, bankId = null, models = null) => {
  const UserModel = models && models.User ? models.User : User;
  const query = { _id: id };
  if (bankId) query.bankId = bankId;

  return await UserModel.findOneAndUpdate(query, { isDeleted: true }, { new: true });
};

exports.findUserByEmail = async (email, models = null) => {
  const UserModel = models && models.User ? models.User : User;
  return await UserModel.findOne({ email, isDeleted: false }).populate("roleId");
};