require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Role = require("./modules/roles/role.model");
const User = require("./modules/users/user.model");
const PERMISSIONS = require("./constants/permissions");
const { randomUUID } = require("crypto");

const seedRoles = async () => {
  const roles = [
    {
      code: "SUPER_ADMIN",
      name: "Super Admin",
      permissions: Object.values(PERMISSIONS),
    },
    {
      code: "BANK_ADMIN",
      name: "Bank Admin",
      permissions: [
        PERMISSIONS.CREATE_BRANCH,
        PERMISSIONS.VIEW_ALL_BRANCHES,
        PERMISSIONS.VIEW_BRANCH_DETAILS,
        PERMISSIONS.UPDATE_BRANCH,
        PERMISSIONS.DELETE_BRANCH,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.VIEW_ALL_USERS,
        PERMISSIONS.UPDATE_USER_STATUS,
        PERMISSIONS.VIEW_ALL_CUSTOMERS,
        PERMISSIONS.VIEW_CUSTOMER_DETAILS,
        PERMISSIONS.UPDATE_CUSTOMER,
        PERMISSIONS.VIEW_ALL_LOANS,
        PERMISSIONS.VIEW_LOAN_DETAILS,
        PERMISSIONS.APPROVE_LOAN,
        PERMISSIONS.REJECT_LOAN,
        PERMISSIONS.VIEW_BANK_REPORTS,
      ],
    },
    {
      code: "BRANCH_MANAGER",
      name: "Branch Manager",
      permissions: [
        PERMISSIONS.CREATE_CUSTOMER,
        PERMISSIONS.VIEW_ALL_CUSTOMERS,
        PERMISSIONS.VIEW_CUSTOMER_DETAILS,
        PERMISSIONS.UPDATE_CUSTOMER,
        PERMISSIONS.CREATE_LOAN,
        PERMISSIONS.VIEW_ALL_LOANS,
        PERMISSIONS.VIEW_LOAN_DETAILS,
        PERMISSIONS.Request_LOAN_APPROVAL,
        PERMISSIONS.VIEW_EMI,
        PERMISSIONS.COLLECT_EMI,
        PERMISSIONS.VIEW_BRANCH_REPORTS,
      ],
    },
    {
      code: "EMPLOYEE",
      name: "Employee",
      permissions: [
        PERMISSIONS.CREATE_CUSTOMER,
        PERMISSIONS.VIEW_ALL_CUSTOMERS,
        PERMISSIONS.CREATE_LOAN,
        PERMISSIONS.VIEW_ALL_LOANS,
        PERMISSIONS.VIEW_EMI,
        PERMISSIONS.COLLECT_EMI,
      ],
    },
    {
      code: "CUSTOMER",
      name: "Customer",
      permissions: [
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.UPDATE_PROFILE,
        PERMISSIONS.VIEW_LOAN_DETAILS,
        PERMISSIONS.VIEW_EMI,
      ],
    },
  ];

  for (const roleData of roles) {
    await Role.findOneAndUpdate(
      { code: roleData.code },
      roleData,
      { upsert: true, new: true }
    );
  }
  console.log("Roles seeded successfully");
};

const seed = async () => {
  try {
    await connectDB();
    await seedRoles();

    const superAdminRole = await Role.findOne({ code: "SUPER_ADMIN" });
    const existingUser = await User.findOne({ email: "admin@nbfc.com" });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        userId: "USR-" + randomUUID().slice(0, 8),
        fullName: "System Admin",
        email: "admin@nbfc.com",
        mobile: "9999999999",
        passwordHash: hashedPassword,
        roleId: superAdminRole._id,
        isActive: true,
      });
      console.log("Admin user created");
    } else {
      console.log("Admin already exists");
    }

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();