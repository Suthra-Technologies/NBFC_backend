const memberService = require("../services/member.service");
const { validationResult } = require('express-validator');

exports.createMember = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Robust context extraction with manual overrides for Super Admins
        let bankId = req.user?.bankId || req.tenant?._id;
        let branchId = req.user?.branchId || req.get("x-branch-id") || req.body.branchId;

        // Process File Uploads if they exist
        if (req.files) {
            if (req.files.photo) req.body.photoUrl = req.files.photo[0].location;
            if (req.files.signature) req.body.signatureUrl = req.files.signature[0].location;
            
            // Handle nested KYC object if files are provided
            if (req.files.idProof || req.files.addressProof || req.files.otherDocument) {
                if (typeof req.body.kyc === 'string') {
                    try { req.body.kyc = JSON.parse(req.body.kyc); } catch(e) {}
                }
                if (!req.body.kyc) req.body.kyc = {};
                if (req.files.idProof) req.body.kyc.idProofUrl = req.files.idProof[0].location;
                if (req.files.addressProof) req.body.kyc.addressProofUrl = req.files.addressProof[0].location;
                if (req.files.otherDocument) req.body.kyc.otherDocumentUrl = req.files.otherDocument[0].location;
            }
        }

        // Multi-tenant override for SUPER_ADMIN
        if (req.user?.role === 'SUPER_ADMIN' && req.body.bankId) {
            bankId = req.body.bankId;
        }

        if (!bankId || !branchId) {
            return res.status(403).json({
                success: false,
                message: "A valid bank and branch context must be provided via token, headers, or body",
                details: { hasBank: !!bankId, hasBranch: !!branchId }
            });
        }

        const member = await memberService.createMember(req.body, bankId, branchId, req.models);
        res.status(201).json({ success: true, data: member, message: "Member successfully registered" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "A member with these unique details already exists" });
        }
        next(err);
    }
};

exports.getAllMembers = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.memberType) query.memberType = req.query.memberType;
        if (req.query.status) query.status = req.query.status;
        if (req.query.mobile) query.mobile1 = req.query.mobile;

        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.query.bankId) bankId = req.query.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const members = await memberService.getAllMembers(bankId, query, req.models);
        res.status(200).json({ success: true, data: members, totalCount: members.length });
    } catch (err) {
        next(err);
    }
};

exports.getMemberById = async (req, res, next) => {
    try {
        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.query.bankId) bankId = req.query.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const member = await memberService.getMemberById(req.params.memberId, bankId, req.models);

        if (!member) {
            return res.status(404).json({ success: false, message: "Member record not found" });
        }

        res.status(200).json({ success: true, data: member });
    } catch (err) {
        next(err);
    }
};

exports.updateMember = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.body.bankId) bankId = req.body.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const member = await memberService.updateMember(req.params.memberId, req.body, bankId, req.models);

        if (!member) {
            return res.status(404).json({ success: false, message: "Member record not found" });
        }

        res.status(200).json({ success: true, data: member, message: "Member details updated successfully" });
    } catch (err) {
        next(err);
    }
};

exports.deleteMember = async (req, res, next) => {
    try {
        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.query.bankId) bankId = req.query.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const member = await memberService.deleteMember(req.params.memberId, bankId, req.models);

        if (!member) {
            return res.status(404).json({ success: false, message: "Member record not found" });
        }

        res.status(200).json({ success: true, message: "Member successfully deactivated" });
    } catch (err) {
        next(err);
    }
};
