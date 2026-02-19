require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Role = require("./modules/roles/role.model");
const User = require("./modules/users/user.model");
const permissions = require("./constants/permissions");
const { randomUUID } = require("crypto");

const seedRoles = async () => {
  const roles = [
    {
      code: "SUPER_ADMIN",
      name: "Super Admin",
      permissions: Object.values(permissions),
    },
    {
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
    },
    {
      code: "BRANCH_MANAGER",
      name: "Branch Manager",
      permissions: [
        permissions.CREATE_CUSTOMER,
        permissions.VIEW_CUSTOMER,
        permissions.CREATE_LOAN,
        permissions.VIEW_LOAN,
        permissions.COLLECT_EMI,
        permissions.VIEW_REPORTS,
      ],
    },
    {
      code: "EMPLOYEE",
      name: "Employee",
      permissions: [
        permissions.CREATE_CUSTOMER,
        permissions.VIEW_CUSTOMER,
        permissions.CREATE_LOAN,
        permissions.VIEW_LOAN,
        permissions.COLLECT_EMI,
      ],
    },
    {
      code: "CUSTOMER",
      name: "Customer",
      permissions: [
        permissions.VIEW_LOAN,
        permissions.COLLECT_EMI,
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