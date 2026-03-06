const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const Bank = require("./bank.model");
const Role = require("../roles/role.model");
const User = require("../users/user.model");

const permissions = require("../../constants/permissions");

const { getTenantConnection } = require("../../utils/tenantConnection");
const emailService = require("../../utils/email.service");
const { logAuditEvent } = require("../../utils/audit");


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
          permissions.CREATE_BRANCH, permissions.VIEW_BRANCH, permissions.UPDATE_BRANCH,
          permissions.CREATE_USER, permissions.VIEW_USER, permissions.MANAGE_ROLES,
          permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.UPDATE_CUSTOMER,
          permissions.CREATE_LOAN, permissions.APPROVE_LOAN, permissions.VIEW_LOAN, permissions.DISBURSE_LOAN,
          permissions.COLLECT_EMI, permissions.CLOSE_LOAN,
          permissions.MANAGE_PRODUCER_MEMBERS, permissions.MANAGE_SHARE_CAPITAL,
          permissions.MANAGE_DEPOSITS, permissions.MANAGE_INSURANCE,
          permissions.PRODUCER_CASH_OPERATIONS,
          permissions.MANAGE_ACCOUNTS, permissions.MANAGE_VOUCHERS, permissions.VIEW_LEDGER,
          permissions.VIEW_REPORTS, permissions.VIEW_ANALYTICS,
        ],
      },
      {
        code: "BRANCH_MANAGER",
        name: "Branch Manager",
        permissions: [
          permissions.VIEW_BRANCH,
          permissions.CREATE_USER, permissions.VIEW_USER,
          permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.UPDATE_CUSTOMER,
          permissions.CREATE_LOAN, permissions.APPROVE_LOAN, permissions.VIEW_LOAN,
          permissions.MANAGE_PRODUCER_MEMBERS,
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
          permissions.VIEW_REPORTS,
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
    const TenantBranch = connection.model("Branch");

    // 5. Create Initial Main Branch
    const initialBranch = await TenantBranch.create({
      branchCode: data.branchCode || "HO001",
      bankId: bank._id,
      name: data.branchName || `${data.name} - Head Office`,
      address: {
        line1: data.line1 || data.address?.line1,
        city: data.city || data.address?.city,
        state: data.state || data.address?.state,
        pincode: data.pincode || data.address?.pincode,
      },
      status: "ACTIVE"
    });

    // 6. Create Initial Bank Admin User
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

    await TenantUser.create({
      userId: "USR-" + randomUUID().slice(0, 8),
      bankId: bank._id,
      branchId: initialBranch._id, // Assign to the newly created branch
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

    // 9. Security Logging - Log bank creation
    logAuditEvent("BANK_CREATION", "SYSTEM", { bankId: bank.bankId, name: bank.name, adminEmail: data.adminEmail });



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