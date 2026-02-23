const userService = require("./user.service");
const Role = require("../roles/role.model");
const mongoose = require("mongoose");

exports.createUser = async (req, res, next) => {
// ... existing code ...
  try {
    const userBankId = req.user.role === "SUPER_ADMIN" ? req.body.bankId : req.user.bankId;

    // Ensure role exists
    const RoleModel = req.models && req.models.Role ? req.models.Role : Role;
    const role = await RoleModel.findById(req.body.roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Restriction: Bank Admin cannot create Super Admin
    if (req.user.role !== "SUPER_ADMIN" && role.code === "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied: Cannot create Super Admin" });
    }

    const user = await userService.createUser(req.body, userBankId, req.models);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let query = {};
    const RoleModel = req.models && req.models.Role ? req.models.Role : Role;

    // Data Routing & Multi-Tenancy Resolution
    // If not SUPER_ADMIN, restrict to user's bank
    if (req.user.role !== "SUPER_ADMIN" && req.user.bankId) {
      // If we're using a tenant connection (req.models), isolation is implicit.
      // If not, we MUST add bankId to the filter.
      if (!req.models) {
         query.bankId = new mongoose.Types.ObjectId(req.user.bankId);
      }
    }

    // Role filtering via query params
    if (req.query.role) {
      const role = await RoleModel.findOne({ code: req.query.role });
      if (role) query.roleId = role._id;
      else query.roleId = { $in: [] }; 
    }

    if (req.query.branchId && mongoose.Types.ObjectId.isValid(req.query.branchId)) {
       query.branchId = new mongoose.Types.ObjectId(req.query.branchId);
    }
    
    // Hierarchical Privacy for Managers
    if (!["SUPER_ADMIN", "BANK_ADMIN"].includes(req.user.role)) {
      const seniorRoles = await RoleModel.find({ 
        code: { $in: ["BANK_ADMIN", "BRANCH_ADMIN"] } 
      });
      const seniorRoleIds = seniorRoles.map(r => r._id);
      
      if (query.roleId) {
        const requestedRoleIdStr = query.roleId.toString();
        if (seniorRoleIds.some(id => id.toString() === requestedRoleIdStr)) {
             query.roleId = { $in: [] }; 
        }
      } else if (seniorRoleIds.length > 0) {
        query.roleId = { $nin: seniorRoleIds };
      }
    }

    const users = await userService.getAllUsers(query, req.models);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const bankId = req.user.role === "SUPER_ADMIN" ? null : req.user.bankId;
    const user = await userService.getUserById(req.params.id, bankId, req.models);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const bankId = req.user.role === "SUPER_ADMIN" ? null : req.user.bankId;
    const user = await userService.updateUser(req.params.id, req.body, bankId, req.models);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const bankId = req.user.role === "SUPER_ADMIN" ? null : req.user.bankId;
    const user = await userService.deleteUser(req.params.id, bankId, req.models);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};