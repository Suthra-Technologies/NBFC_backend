const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    houseNo: String,
    area: String,
    rural: String,
    country: { type: String, default: 'India' },
    state: String,
    district: String,
    mandal: String,
    cityArea: String,
    landMark: String,
    poSubCity: String,
    pincode: String
}, { _id: false });

const nomineeSchema = new mongoose.Schema({
    name: String,
    relation: String,
    age: String,
    mobileNo: String,
    address: addressSchema
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    companyName: String,
    joiningDate: Date,
    currentGrade: String,
    operationArea: String,
    joiningGrade: String
}, { _id: false });

const introducerSchema = new mongoose.Schema({
    introducerId: { type: String, required: true, unique: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },

    postAppliedFor: { type: String, required: true },
    
    // Particulars
    employeeName: { type: String, required: true },
    rural: String,
    country: { type: String, default: 'India' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Select'], default: 'Select' },
    poSubCity: String,
    pincode: String,
    houseNo: String,
    district: String,
    residenceNo: String,
    area: String,
    state: String,
    mobileNo: { type: String, required: true },
    ruralArea: String,
    cityArea: String,
    landMark: String,
    mandal: String,
    dob: Date,
    age: Number,
    photoUrl: String,
    signatureUrl: String,

    // Family Details
    fatherHusbandName: String,
    motherMaidenName: String,
    nominee: nomineeSchema,
    familyRuralArea: String,
    familyState: String,
    familyMandal: String,

    // Other Details
    bankAccount: {
        bankName: String,
        branch: String,
        branchCode: String,
        accountNo: String,
        ifscCode: String,
        bankAddress: String
    },
    idProofType: String,
    relateCode: String,
    proposedArea: String,
    introducerName: String,
    introducerDesigCode: String,
    issuedOn: Date,
    validUpto: Date,
    bloodGroup: String,
    occupation: String,
    qualification: String,
    introducerAadhar: String,

    // Past Experience
    experience: experienceSchema,

    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// SaaS Isolation Index
introducerSchema.index({ bankId: 1, branchId: 1 });
introducerSchema.index({ bankId: 1, introducerId: 1 });
introducerSchema.index({ bankId: 1, mobileNo: 1 });

const Introducer = mongoose.model("Introducer", introducerSchema);
module.exports = Introducer;
