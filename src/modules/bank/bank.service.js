const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const Bank = require("./bank.model");
const Role = require("../roles/role.model");
const User = require("../users/user.model");

const permissions = require("../../constants/permissions");

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
      subdomain: data.subdomain || data.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    });

    let bankAdminRole = await Role.findOne({ code: "BANK_ADMIN" });

    if (!bankAdminRole) {
      bankAdminRole = await Role.create({
        code: "BANK_ADMIN",
        name: "Bank Admin",
        permissions: [
          permissions.CREATE_BRANCH,
          permissions.VIEW_BRANCH,
          permissions.CREATE_USER,
          permissions.VIEW_USER,
          permissions.CREATE_CUSTOMER,
          permissions.VIEW_CUSTOMER,
          permissions.CREATE_LOAN,
          permissions.APPROVE_LOAN,
          permissions.VIEW_LOAN,
          permissions.VIEW_REPORTS,
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