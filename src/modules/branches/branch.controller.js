const branchService = require("./branch.service");
const Bank = require("../bank/bank.model");
const User = require("../users/user.model");
const Role = require("../roles/role.model");
const Branch = require("./branch.model");

exports.createBranch = async (req, res, next) => {
    try {
        const { branchCode, name, address, manager, status } = req.body;
        const userRole = req.user.role;
        let targetBankId;

        if (userRole === "SUPER_ADMIN") {
            targetBankId = req.body.bankId; // Must provide bankId for Super Admin
        } else if (userRole === "BANK_ADMIN") {
            targetBankId = req.user.bankId;
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!targetBankId) {
            return res.status(400).json({ message: "Bank ID is required" });
        }

        // Check existing branches count
        const bank = await Bank.findOne({ _id: targetBankId, isDeleted: false });
        if (!bank) {
            return res.status(404).json({ message: "Bank not found" });
        }

        const currentBranchCount = await Branch.countDocuments({
            bankId: targetBankId,
            isDeleted: false,
        });

        if (currentBranchCount >= bank.maxBranches) {
            return res.status(400).json({
                message: `Branch creation limit reached for this bank (Max: ${bank.maxBranches}).`,
            });
        }

        // Prepare create payload
        const branchData = {
            branchCode,
            name,
            address,
            manager, // Optional manager data { fullName, email, mobile, password }
            status: status || "ACTIVE", // Default ACTIVE
        };

        // If manager is provided, we need to create the user + branch atomically ideally, but step-by-step for now
        // Actually, branchService.createBranch handles this logic, except checking bankId and limit again.
        // I can delegate to service, passing bankId.

        const newBranch = await branchService.createBranch(branchData, targetBankId);

        res.status(201).json({
            success: true,
            data: newBranch,
            message: "Branch created successfully",
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllBranches = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        let query = {};

        if (userRole === "BANK_ADMIN") {
            query.bankId = req.user.bankId;
        }

        // Optional query filters
        if (req.query.status) query.status = req.query.status;

        const branches = await branchService.getAllBranches(query);

        res.status(200).json({
            success: true,
            data: branches,
        });
    } catch (err) {
        next(err);
    }
};

exports.getBranchById = async (req, res, next) => {
    try {
        const branch = await branchService.getBranchById(req.params.id);

        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // Security check: ensure bank admin accessing their own branch
        if (
            req.user.role === "BANK_ADMIN" &&
            branch.bankId.toString() !== req.user.bankId.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({
            success: true,
            data: branch,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateBranch = async (req, res, next) => {
    try {
        const branchId = req.params.id;
        const updates = req.body; // Can define status explicitly here if needed

        // Check ownership before update
        const branch = await branchService.getBranchById(branchId);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        if (
            req.user.role === "BANK_ADMIN" &&
            branch.bankId.toString() !== req.user.bankId.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedBranch = await branchService.updateBranch(branchId, updates);

        res.status(200).json({
            success: true,
            data: updatedBranch,
            message: "Branch updated successfully",
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteBranch = async (req, res, next) => {
    try {
        const branchId = req.params.id;

        const branch = await branchService.getBranchById(branchId);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        if (
            req.user.role === "BANK_ADMIN" &&
            branch.bankId.toString() !== req.user.bankId.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        await branchService.deleteBranch(branchId);

        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
