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
      { code: "BRANCH_ADMIN", name: "Branch Administrator", permissions: [
        permissions.CREATE_BRANCH, permissions.VIEW_BRANCH, permissions.UPDATE_BRANCH,
        permissions.CREATE_USER, permissions.VIEW_USER, permissions.MANAGE_ROLES,
        permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.UPDATE_CUSTOMER,
        permissions.CREATE_LOAN, permissions.VIEW_LOAN, permissions.APPROVE_LOAN, permissions.DISBURSE_LOAN,
        permissions.COLLECT_EMI, permissions.CLOSE_LOAN,
        permissions.MANAGE_PRODUCER_MEMBERS, permissions.MANAGE_SHARE_CAPITAL, permissions.MANAGE_DEPOSITS, permissions.MANAGE_INSURANCE,
        permissions.MANAGE_ACCOUNTS, permissions.MANAGE_VOUCHERS, permissions.VIEW_LEDGER,
        permissions.VIEW_REPORTS, permissions.VIEW_ANALYTICS, permissions.VIEW_MIS_REPORTS
      ]},
      { code: "MANAGER", name: "Branch Manager", permissions: [
        permissions.VIEW_BRANCH, permissions.CREATE_USER, permissions.VIEW_USER,
        permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER, permissions.UPDATE_CUSTOMER,
        permissions.CREATE_LOAN, permissions.VIEW_LOAN, permissions.APPROVE_LOAN,
        permissions.COLLECT_EMI, permissions.CLOSE_LOAN,
        permissions.MANAGE_PRODUCER_MEMBERS, permissions.MANAGE_DEPOSITS,
        permissions.VIEW_LEDGER, permissions.VIEW_REPORTS, permissions.VIEW_ANALYTICS
      ]},
      { code: "STAFF", name: "Operations Staff", permissions: [
        permissions.VIEW_USER, permissions.CREATE_CUSTOMER, permissions.VIEW_CUSTOMER,
        permissions.VIEW_LOAN, permissions.CREATE_LOAN, permissions.COLLECT_EMI,
        permissions.MANAGE_PRODUCER_MEMBERS, permissions.MANAGE_DEPOSITS
      ]},
      { code: "CASHIER", name: "Cashier", permissions: [
        permissions.VIEW_CUSTOMER, permissions.COLLECT_EMI, permissions.VIEW_LOAN,
        permissions.PRODUCER_CASH_OPERATIONS, permissions.MANAGE_VOUCHERS
      ]},
      { code: "ACCOUNTANT", name: "Bank Accountant", permissions: [
        permissions.VIEW_REPORTS, permissions.VIEW_LOAN, permissions.VIEW_LEDGER,
        permissions.MANAGE_ACCOUNTS, permissions.MANAGE_VOUCHERS, permissions.MANAGE_CHEQUES,
        permissions.VIEW_ANALYTICS, permissions.VIEW_MIS_REPORTS
      ]},
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

exports.updateRolePermissions = async (id, permissions, models = null) => {
  const RoleModel = models && models.Role ? models.Role : Role;
  const role = await RoleModel.findByIdAndUpdate(
    id,
    { $set: { permissions } },
    { new: true }
  );
  if (!role) throw new Error("Role not found");
  return role;
};