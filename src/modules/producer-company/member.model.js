const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    houseNo: String,
    area: String,
    rural: String,
    country: { type: String, default: 'India' },
    state: String,
    district: String,
    mandal: String,
    city: String,
    landmark: String,
    ruralArea: String,
    cityArea: String,
    pincode: String
}, { _id: false });

const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true, unique: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    
    memberType: { type: String, enum: ['MEMBER', 'ASSOCIATE'], default: 'MEMBER' },
    registrationDate: { type: Date, default: Date.now },
    membershipFee: { type: Number, default: 50 },

    // Customer Details
    name: { type: String, required: true },
    fatherHusbandName: String,
    motherName: String,
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    dob: Date,
    age: Number,
    occupation: String,
    aadharNo: String,
    panNo: String,
    photoUrl: String,
    signatureUrl: String,

    // Mobile Details
    mobile1: { type: String, required: true },
    landline: String,
    alternateMobile: String,
    mobile4: String,

    // Addresses
    permanentAddress: addressSchema,
    correspondenceAddress: addressSchema,
    sameAsPermanent: { type: Boolean, default: false },

    // Nominee
    nominee: {
        name: String,
        relation: String,
        age: Number,
        mobileNo: String,
        address: addressSchema,
        sameAsPermanent: { type: Boolean, default: false }
    },

    // KYC
    kyc: {
        idProofType: String,
        idProofUrl: String,
        addressProofType: String,
        addressProofUrl: String,
        otherDocumentLabel: String,
        otherDocumentUrl: String
    },

    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// SaaS Isolation Index
memberSchema.index({ bankId: 1, branchId: 1 });
memberSchema.index({ bankId: 1, memberId: 1 });
memberSchema.index({ bankId: 1, mobile1: 1 });

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
module.exports.schema = memberSchema;
