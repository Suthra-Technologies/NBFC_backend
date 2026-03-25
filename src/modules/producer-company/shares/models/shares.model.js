const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  admissionNo: {
    type: String,
  },
  sharesEachOf: {
    type: Number,
    default: 100,
  },
  noOfSharesHeld: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  issuedDate: {
    type: Date,
    required: true,
  },
  distinctiveFrom: {
    type: Number,
  },
  distinctiveTo: {
    type: Number,
  },
  distinctiveNos: {
    type: String, // e.g. "1-10"
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "SURRENDERED"],
    default: "ACTIVE",
  },
}, { timestamps: true });

module.exports = mongoose.model("Shares", shareSchema);
