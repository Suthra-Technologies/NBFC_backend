const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const Bank = require("./bank.model");
const Role = require("../roles/role.model");
const User = require("../users/user.model");

const permissions = require("../../constants/permissions");

const { getTenantConnection } = require("../../utils/tenantConnection");

exports.createBankWithAdmin = async (data) => {
  try {
    const subdomain = data.subdomain || data.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const dbName = `bank_${subdomain}_db`;

    const bank = await Bank.create({
      bankId: "BANK-" + randomUUID().slice(0, 8),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      logo: data.logo,
      maxBranches: data.maxBranches,
      subdomain: subdomain,
      dbName: dbName,
    });

    // Switch to Tenant Database for User and local Role creation
    const connection = await getTenantConnection(dbName);
    const TenantUser = connection.model("User");
    const TenantRole = connection.model("Role");

    // Seed default roles for the new bank
    const defaultRoles = [
      {
        code: "BANK_ADMIN",
        name: "Bank Admin",
        permissions: Object.values(permissions),
      },
      {
        code: "BRANCH_ADMIN",
        name: "Branch Administrator",
        permissions: [
          permissions.CREATE_BRANCH,
          permissions.VIEW_BRANCH,
          permissions.CREATE_USER,
          permissions.VIEW_USER,
          permissions.CREATE_CUSTOMER,
          permissions.VIEW_CUSTOMER,
          permissions.CREATE_LOAN,
          permissions.VIEW_LOAN,
          permissions.VIEW_REPORTS,
        ],
      },
      {
        code: "MANAGER",
        name: "Branch Manager",
        permissions: [
          permissions.VIEW_USER,
          permissions.CREATE_USER,
          permissions.VIEW_BRANCH,
          permissions.CREATE_CUSTOMER,
          permissions.VIEW_CUSTOMER,
          permissions.CREATE_LOAN,
          permissions.VIEW_LOAN,
          permissions.VIEW_REPORTS,
        ],
      },
      {
        code: "STAFF",
        name: "Operations Staff",
        permissions: [
          permissions.CREATE_CUSTOMER,
          permissions.VIEW_CUSTOMER,
          permissions.VIEW_LOAN,
        ],
      },
      {
        code: "CASHIER",
        name: "Cashier",
        permissions: [
          permissions.VIEW_CUSTOMER,
          permissions.COLLECT_EMI,
        ],
      },
      {
        code: "ACCOUNTANT",
        name: "Bank Accountant",
        permissions: [
          permissions.VIEW_REPORTS,
          permissions.VIEW_LOAN,
        ],
      },
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await TenantRole.findOne({ code: roleData.code });
      if (!existingRole) {
        await TenantRole.create(roleData);
      }
    }

    const bankAdminRole = await TenantRole.findOne({ code: "BANK_ADMIN" });

    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

    await TenantUser.create({
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

// get bank by id (supports both Logical bankId and MongoDB _id)
exports.getBankById = async (id) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const query = isObjectId ? { _id: id } : { bankId: id };
  query.isDeleted = false;
  
  return await Bank.findOne(query);
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