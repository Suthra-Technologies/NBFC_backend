const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const Branch = require("./branch.model");
const Bank = require("../bank/bank.model");
const User = require("../users/user.model");
const Role = require("../roles/role.model");

const permissions = require("../../constants/permissions");

exports.createBranch = async (data, userBankId, models = null) => {
    const BranchModel = models && models.Branch ? models.Branch : Branch;
    const UserModel = models && models.User ? models.User : User;
    const RoleModel = models && models.Role ? models.Role : Role;

    // 1. Verify Bank Restrictions (Bank is ALWAYS in main DB)
    const bank = await Bank.findOne({ _id: userBankId, isDeleted: false });
    if (!bank) {
        throw new Error("Bank not found or inactive.");
    }

    // Check max branches limit
    const currentBranchCount = await BranchModel.countDocuments({
        bankId: userBankId,
        isDeleted: false,
    });

    if (currentBranchCount >= bank.maxBranches) {
        throw new Error(
            `Branch creation limit reached. Max allowed: ${bank.maxBranches}`
        );
    }

    // 2. Create Branch
    const branch = await BranchModel.create({
        branchCode: data.branchCode || "BR-" + randomUUID().slice(0, 8),
        bankId: userBankId,
        name: data.name,
        address: data.address,
        status: data.status || "ACTIVE",
    });

    // 3. Optional Manager Creation
    if (data.manager) {
        let branchManagerRole = await RoleModel.findOne({ code: "BRANCH_MANAGER" });
        if (!branchManagerRole) {
            branchManagerRole = await RoleModel.create({
                code: "BRANCH_MANAGER",
                name: "Branch Manager",
                permissions: [
                    permissions.CREATE_CUSTOMER,
                    permissions.VIEW_CUSTOMER,
                    permissions.CREATE_LOAN,
                    permissions.VIEW_LOAN,
                    permissions.COLLECT_EMI,
                    permissions.VIEW_REPORTS,
                ],
            });
        }

        const hashedPassword = await bcrypt.hash(data.manager.password, 10);

        const manager = await UserModel.create({
            userId: "USR-MGR-" + randomUUID().slice(0, 8),
            bankId: userBankId,
            branchId: branch._id,
            fullName: data.manager.fullName,
            email: data.manager.email,
            mobile: data.manager.mobile,
            passwordHash: hashedPassword,
            roleId: branchManagerRole._id,
        });

        branch.managerId = manager._id;
        await branch.save();
    }

    return branch;
};

exports.getAllBranches = async (query = {}, models = null) => {
    const BranchModel = models && models.Branch ? models.Branch : Branch;
    return await BranchModel.find({ ...query, isDeleted: false }).populate(
        "managerId",
        "fullName email mobile"
    );
};

exports.getBranchById = async (id, models = null) => {
    const BranchModel = models && models.Branch ? models.Branch : Branch;
    return await BranchModel.findOne({ _id: id, isDeleted: false }).populate(
        "managerId",
        "fullName email mobile"
    );
};

exports.updateBranch = async (id, data, models = null) => {
    const BranchModel = models && models.Branch ? models.Branch : Branch;
    return await BranchModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteBranch = async (id, models = null) => {
    const BranchModel = models && models.Branch ? models.Branch : Branch;
    const branch = await BranchModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    return branch;
};
