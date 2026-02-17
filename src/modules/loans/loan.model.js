const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    loanId: {
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

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    principalAmount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    tenureMonths: {
      type: Number,
      required: true,
    },

    interestType: {
      type: String,
      enum: ["FLAT", "REDUCING"],
      required: true,
    },

    totalInterest: Number,
    totalPayable: Number,
    emiAmount: Number,

    outstandingAmount: Number,

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "DISBURSED",
        "CLOSED",
        "NPA",
      ],
      default: "PENDING",
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    disbursedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    disbursedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

loanSchema.index({ bankId: 1, branchId: 1, status: 1 });
loanSchema.index({ bankId: 1, customerId: 1 });

module.exports = mongoose.model("Loan", loanSchema);