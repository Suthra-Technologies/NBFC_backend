const customerService = require("./customer.service");

exports.createCustomer = async (req, res, next) => {
    try {
        // Employee/Manager bankId and branchId come from token
        const bankId = req.user.bankId;
        let branchId = req.user.branchId;

        // If Bank Admin, they can specify the branch
        if (req.user.role === "BANK_ADMIN" && req.body.branchId) {
            branchId = req.body.branchId;
        }

        if (!bankId || !branchId) {
            return res.status(400).json({ message: "User must be assigned to a bank and branch" });
        }

        const customer = await customerService.createCustomer(req.body, bankId, branchId, req.models);
        res.status(201).json({ success: true, data: customer });
    } catch (err) {
        next(err);
    }
};

exports.getAllCustomers = async (req, res, next) => {
    try {
        let query = { bankId: req.user.bankId };

        // Scope to branch if branch manager or employee
        if (req.user.role === "BRANCH_MANAGER" || req.user.role === "EMPLOYEE") {
            query.branchId = req.user.branchId;
        }

        // Search filters
        if (req.query.mobile) query["personalInfo.mobile"] = req.query.mobile;
        if (req.query.branchId && req.user.role === "BANK_ADMIN") query.branchId = req.query.branchId;

        const customers = await customerService.getAllCustomers(query, req.models);
        res.status(200).json({ success: true, data: customers });
    } catch (err) {
        next(err);
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id, req.user.bankId, req.models);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ success: true, data: customer });
    } catch (err) {
        next(err);
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.body, req.user.bankId, req.models);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ success: true, data: customer });
    } catch (err) {
        next(err);
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.deleteCustomer(req.params.id, req.user.bankId, req.models);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (err) {
        next(err);
    }
};
