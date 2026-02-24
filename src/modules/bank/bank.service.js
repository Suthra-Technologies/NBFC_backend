const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const Bank = require("./bank.model");
const Role = require("../roles/role.model");
const User = require("../users/user.model");

const permissions = require("../../constants/permissions");

const { getTenantConnection } = require("../../utils/tenantConnection");
const emailService = require("../../utils/email.service");

const RESERVED_SUBDOMAINS = ["admin", "api", "www", "portal", "mail", "status", "nbfc", "finware"];

exports.createBankWithAdmin = async (data) => {
  try {
    // 1. Generate & Validate Subdomain
    let subdomain = data.subdomain ||
      data.name.toLowerCase().trim()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      throw new Error(`Subdomain '${subdomain}' is reserved and cannot be used.`);
    }

    // Check availability
    const existingBank = await Bank.findOne({ subdomain, isDeleted: false });
    if (existingBank) {
      throw new Error(`Subdomain '${subdomain}' is already taken.`);
    }

    const dbName = `bank_${subdomain.replace(/-/g, "_")}_db`;

    // 2. Create Bank Registry Record
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

    // 3. Switch to Tenant Database for Seeding & User Creation
    const connection = await getTenantConnection(dbName);
    const TenantUser = connection.model("User");
    const TenantRole = connection.model("Role");

    // 4. Seed Standard Roles to Tenant DB
    const rolesToSeed = [
      {
        code: "BANK_ADMIN",
        name: "Bank Administrator",
        permissions: [
          permissions.CREATE_BRANCH, permissions.VIEW_BRANCH,
          permissions.CREATE_USER, permissions.VIEW_USER,
          permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER,
          permissions.CREATE_LOAN, permissions.APPROVE_LOAN, permissions.VIEW_LOAN,
          permissions.VIEW_REPORTS,
        ],
      },
      {
        code: "BRANCH_MANAGER",
        name: "Branch Manager",
        permissions: [
          permissions.VIEW_BRANCH,
          permissions.CREATE_USER, permissions.VIEW_USER,
          permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER,
          permissions.CREATE_LOAN, permissions.APPROVE_LOAN, permissions.VIEW_LOAN,
          permissions.COLLECT_EMI, permissions.VIEW_REPORTS,
        ],
      },
      {
        code: "CASHIER",
        name: "Cashier / Counter Staff",
        permissions: [
          permissions.VIEW_CUSTOMER,
          permissions.COLLECT_EMI,
          permissions.VIEW_LOAN,
        ],
      },
    ];

    for (const roleData of rolesToSeed) {
      await TenantRole.findOneAndUpdate(
        { code: roleData.code },
        roleData,
        { upsert: true, new: true }
      );
    }

    const bankAdminRole = await TenantRole.findOne({ code: "BANK_ADMIN" });

    // 5. Create Initial Bank Admin User
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

    // 6. Send Welcome Email to Admin
    await emailService.sendBankWelcomeEmail(
      { name: bank.name, subdomain: bank.subdomain },
      { name: data.adminName, email: data.adminEmail, password: data.adminPassword }
    );

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