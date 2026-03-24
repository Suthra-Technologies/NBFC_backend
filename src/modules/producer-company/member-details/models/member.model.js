const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    houseNo: String,
    area: String,
    rural: String,
    country: { type: String, default: 'India' },
    state: { type: String, default: 'ANDHRA PRADESH' },
    district: String,
    mandal: String,
    city: String,
    landmark: String,
    ruralArea: String,
    cityArea: String,
    pincode: String
}, { _id: false });

const nomineeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relation: { type: String, required: true },
    age: { type: Number, required: true },
    houseNo: { type: String, required: true },
    area: { type: String, required: true },
    rural: { type: String, required: true },
    country: { type: String, default: 'India' },
    state: { type: String, default: 'ANDHRA PRADESH', required: true },
    district: { type: String, required: true },
    mandal: String,
    city: { type: String, required: true },
    landmark: String,
    ruralArea: String,
    cityArea: String,
    pincode: { type: String, required: true },
    mobileNo: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    }
}, { _id: false });

const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true, unique: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },

    memberType: { type: String, enum: ['MEMBER', 'ASSOCIATE'], default: 'MEMBER', required: true },
    registrationDate: { type: Date, default: Date.now, required: true },
    membershipFee: { type: Number, default: 50 },

    // Customer Details
    name: { type: String, required: true },
    fatherHusbandName: String,
    motherName: String,
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    dob: Date,
    age: Number,
    occupation: String,
    aadharNo: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid 12-digit Aadhar number!`
        }
    },
    panNo: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: props => `${props.value} is not a valid PAN format!`
        }
    },
    photoUrl: String,
    signatureUrl: String,

    // Mobile Details
    mobile1: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    landline: String,
    alternateMobile: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    mobile4: String,

    // Addresses
    permanentAddress: {
        type: addressSchema,
        required: true
    },
    correspondenceAddress: addressSchema,
    sameAsPermanent: { type: Boolean, default: false },

    // Nominee
    nominee: nomineeSchema,

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
