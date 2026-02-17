const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    branchCode: {
      type: String,
      required: true,
      unique: true,
    },

    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

branchSchema.index({ bankId: 1, branchCode: 1 });

module.exports = mongoose.model("Branch", branchSchema);