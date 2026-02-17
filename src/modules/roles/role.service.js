const Role = require("./role.model");

exports.createRole = async (data) => {
  const role = await Role.create(data);
  return role;
};

exports.getRoles = async () => {
  return await Role.find();
};