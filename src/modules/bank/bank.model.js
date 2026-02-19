const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    bankId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },

    logo: {
      type: String, // URL or path to logo
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    maxBranches: {
      type: Number,
      default: 3,
    },

    subscriptionPlan: {
      type: String,
      enum: ["BASIC", "PRO", "ENTERPRISE"],
      default: "BASIC",
    },

    subscriptionExpiry: Date,

    subdomain: {
      type: String,
      unique: true,
      sparse: true, // Allow nulls while maintaining uniqueness
      trim: true,
      lowercase: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bankSchema.index({ bankId: 1 });
bankSchema.index({ email: 1 });
bankSchema.index({ subdomain: 1 });

module.exports = mongoose.model("Bank", bankSchema);