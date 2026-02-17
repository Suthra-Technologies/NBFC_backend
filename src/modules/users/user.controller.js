const userService = require("./user.service");
const Role = require("../roles/role.model");

exports.createUser = async (req, res, next) => {
  try {
    const userBankId = req.user.role === "SUPER_ADMIN" ? req.body.bankId : req.user.bankId;

    // Ensure role exists
    const role = await Role.findById(req.body.roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Restriction: Bank Admin cannot create Super Admin
    if (req.user.role !== "SUPER_ADMIN" && role.code === "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied: Cannot create Super Admin" });
    }

    const user = await userService.createUser(req.body, userBankId);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let query = {};

    // If not SUPER_ADMIN, restrict to user's bank
    if (req.user.role !== "SUPER_ADMIN") {
      query.bankId = req.user.bankId;
    }

    // If query parameters are provided (e.g. role, branchId)
    if (req.query.role) {
      const role = await Role.findOne({ code: req.query.role });
      if (role) query.roleId = role._id;
    }
    if (req.query.branchId) query.branchId = req.query.branchId;
    if (req.query.bankId && req.user.role === "SUPER_ADMIN") query.bankId = req.query.bankId;

    const users = await userService.getAllUsers(query);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const bankId = req.user.role === "SUPER_ADMIN" ? null : req.user.bankId;
    const user = await userService.getUserById(req.params.id, bankId);

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
    const user = await userService.updateUser(req.params.id, req.body, bankId);

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
    const user = await userService.deleteUser(req.params.id, bankId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};