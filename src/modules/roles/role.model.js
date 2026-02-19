const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
module.exports.schema = roleSchema;