const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const Bank = require("./bank.model");
const Role = require("../roles/role.model");
const User = require("../users/user.model");

const PERMISSIONS = require("../../constants/permissions");
// ... imports

exports.createBankWithAdmin = async (data) => {
  try {
    const bank = await Bank.create({
      bankId: "BANK-" + randomUUID().slice(0, 8),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      logo: data.logo,
      maxBranches: data.maxBranches,
    });

    let bankAdminRole = await Role.findOne({ code: "BANK_ADMIN" });

    if (!bankAdminRole) {
      bankAdminRole = await Role.create({
        code: "BANK_ADMIN",
        name: "Bank Admin",
        permissions: [
          PERMISSIONS.CREATE_BRANCH,
          PERMISSIONS.VIEW_ALL_BRANCHES,
          PERMISSIONS.UPDATE_BRANCH,
          PERMISSIONS.DELETE_BRANCH,
          PERMISSIONS.CREATE_USER,
          PERMISSIONS.VIEW_ALL_USERS,
          PERMISSIONS.UPDATE_USER_STATUS,
          PERMISSIONS.VIEW_ALL_CUSTOMERS,
          PERMISSIONS.VIEW_CUSTOMER_DETAILS,
          PERMISSIONS.VIEW_ALL_LOANS,
          PERMISSIONS.VIEW_LOAN_DETAILS,
          PERMISSIONS.APPROVE_LOAN,
          PERMISSIONS.REJECT_LOAN,
          PERMISSIONS.VIEW_BANK_REPORTS,
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

    await User.create({
      userId: "USR-" + randomUUID().slice(0, 8),
      bankId: bank._id,
      fullName: data.adminName,
      email: data.adminEmail,
      mobile: data.adminMobile,
      passwordHash: hashedPassword,
      roleId: bankAdminRole._id,
    });

    return bank;
  } catch (error) {
    throw error;
  }
};

// get all banks
exports.getAllBanks = async () => {
  return await Bank.find({ isDeleted: false });
};

// get bank by id
exports.getBankById = async (id) => {
  return await Bank.findOne({ _id: id, isDeleted: false });
};

// update bank
exports.updateBank = async (id, data) => {
  return await Bank.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }
  );
};

// soft delete bank
exports.deleteBank = async (id) => {
  return await Bank.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};