const introducerService = require("../services/introducer.service");
const { validationResult } = require('express-validator');
const { getTenantConnection } = require("../../../../utils/tenantConnection");
const Bank = require("../../../../modules/bank/bank.model");

// Helper to resolve tenant models if middleware didn't (e.g. no subdomain/header)
const getModelsForBank = async (bankId, currentModels) => {
    if (currentModels && currentModels.Introducer) return currentModels;
    if (!bankId) return null;
    
    try {
        const bank = await Bank.findById(bankId);
        if (bank && bank.dbName) {
            const connection = await getTenantConnection(bank.dbName);
            return {
                Introducer: connection.model("Introducer")
            };
        }
    } catch (err) {
        console.error("Dynamic Tenant Resolution Error:", err);
    }
    return null;
};

exports.createIntroducer = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let bankId = req.user?.bankId || req.tenant?._id;
        let branchId = req.user?.branchId || req.get("x-branch-id") || req.body.branchId;

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

        if (req.files) {
            if (req.files.photo) req.body.photoUrl = req.files.photo[0].location;
            if (req.files.signature) req.body.signatureUrl = req.files.signature[0].location;
        }

        const models = await getModelsForBank(bankId, req.models);
        const introducer = await introducerService.createIntroducer(req.body, bankId, branchId, models);
        res.status(201).json({ success: true, data: introducer, message: "Introducer successfully registered" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "An employee with these unique details already exists" });
        }
        next(err);
    }
};

exports.getAllIntroducers = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.postAppliedFor) query.postAppliedFor = req.query.postAppliedFor;
        if (req.query.status) query.status = req.query.status;
        if (req.query.mobile) query.mobileNo = req.query.mobile;

        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.query.bankId) bankId = req.query.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const models = await getModelsForBank(bankId, req.models);
        const introducers = await introducerService.getAllIntroducers(bankId, query, models);
        res.status(200).json({ success: true, data: introducers, totalCount: introducers.length });
    } catch (err) {
        next(err);
    }
};

exports.getIntroducerById = async (req, res, next) => {
    try {
        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.query.bankId) bankId = req.query.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const models = await getModelsForBank(bankId, req.models);
        const introducer = await introducerService.getIntroducerById(req.params.introducerId, bankId, models);

        if (!introducer) {
            return res.status(404).json({ success: false, message: "Introducer record not found" });
        }

        res.status(200).json({ success: true, data: introducer });
    } catch (err) {
        next(err);
    }
};

exports.updateIntroducer = async (req, res, next) => {
    try {
        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.body.bankId) bankId = req.body.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const models = await getModelsForBank(bankId, req.models);
        const introducer = await introducerService.updateIntroducer(req.params.introducerId, req.body, bankId, models);

        if (!introducer) {
            return res.status(404).json({ success: false, message: "Introducer record not found" });
        }

        res.status(200).json({ success: true, data: introducer, message: "Introducer details updated successfully" });
    } catch (err) {
        next(err);
    }
};

exports.deleteIntroducer = async (req, res, next) => {
    try {
        let bankId = req.user?.bankId || req.tenant?._id;
        if (req.user?.role === 'SUPER_ADMIN' && req.query.bankId) bankId = req.query.bankId;

        if (!bankId) return res.status(401).json({ success: false, message: "Bank context required" });

        const models = await getModelsForBank(bankId, req.models);
        const introducer = await introducerService.deleteIntroducer(req.params.introducerId, bankId, models);

        if (!introducer) {
            return res.status(404).json({ success: false, message: "Introducer record not found" });
        }

        res.status(200).json({ success: true, message: "Introducer successfully deactivated" });
    } catch (err) {
        next(err);
    }
};

