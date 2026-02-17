const roleService = require("./role.service");

exports.createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles();
    res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
};