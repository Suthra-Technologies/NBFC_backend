const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: {
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

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    personalInfo: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      email: String,
      dob: Date,
      gender: String,
    },

    kyc: {
      panNumber: String,
      aadhaarMasked: String,
      idProofUrl: String,
      addressProofUrl: String,
    },

    financialInfo: {
      occupation: String,
      monthlyIncome: Number,
    },

    riskProfile: {
      score: Number,
      category: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// SaaS Isolation Index
customerSchema.index({ bankId: 1, branchId: 1 });
customerSchema.index({ bankId: 1, "personalInfo.mobile": 1 });

module.exports = mongoose.model("Customer", customerSchema);