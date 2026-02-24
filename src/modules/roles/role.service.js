const Role = require("./role.model");

exports.createRole = async (data, models = null) => {
  const RoleModel = models && models.Role ? models.Role : Role;
  const role = await RoleModel.create(data);
  return role;
};

exports.getRoles = async (models = null, userRole = null) => {
  const RoleModel = models && models.Role ? models.Role : Role;
  let roles = await RoleModel.find();

  // Ensure standard roles have required minimum permissions
  try {
    const permissions = require("../../constants/permissions");
    const defaultRoles = [
      { code: "BANK_ADMIN", name: "Bank Admin", permissions: Object.values(permissions) },
      { code: "BRANCH_ADMIN", name: "Branch Administrator", permissions: [permissions.CREATE_BRANCH, permissions.VIEW_BRANCH, permissions.CREATE_USER, permissions.VIEW_USER, permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.CREATE_LOAN, permissions.VIEW_LOAN, permissions.VIEW_REPORTS] },
      { code: "MANAGER", name: "Branch Manager", permissions: [permissions.VIEW_USER, permissions.CREATE_USER, permissions.VIEW_BRANCH, permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.CREATE_LOAN, permissions.VIEW_LOAN, permissions.VIEW_REPORTS] },
      { code: "STAFF", name: "Operations Staff", permissions: [permissions.VIEW_USER, permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.VIEW_LOAN] },
      { code: "CASHIER", name: "Cashier", permissions: [permissions.VIEW_CUSTOMER, permissions.COLLECT_EMI] },
      { code: "ACCOUNTANT", name: "Bank Accountant", permissions: [permissions.VIEW_REPORTS, permissions.VIEW_LOAN] },
    ];

    let needsRefresh = false;
    for (const roleData of defaultRoles) {
      const existing = roles.find(r => r.code === roleData.code);
      if (!existing) {
        await RoleModel.create(roleData);
        needsRefresh = true;
      } else {
        // Check if permissions are missing
        const missingPerms = roleData.permissions.filter(p => !existing.permissions.includes(p));
        if (missingPerms.length > 0) {
          await RoleModel.updateOne(
            { _id: existing._id },
            { $addToSet: { permissions: { $each: roleData.permissions } } }
          );
          needsRefresh = true;
        }
      }
    }
    if (needsRefresh) {
      roles = await RoleModel.find();
    }
  } catch (err) {
    console.error("Role permission sync failed:", err);
  }

  // Hierarchical Filter: Usually, only Super Admin should see the Super Admin role
  if (userRole !== "SUPER_ADMIN") {
      roles = roles.filter(r => r.code !== "SUPER_ADMIN");
  }

  return roles;
};