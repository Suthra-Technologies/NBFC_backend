const Bank = require("../bank/bank.model");
const User = require("../users/user.model");
const Loan = require("../loans/loan.model");
const Customer = require("../customers/customer.model");
const Role = require("../roles/role.model");

exports.getPlatformStats = async () => {
    const totalBanks = await Bank.countDocuments({ isDeleted: { $ne: true } });

    // Total customers across all banks (this counts in the MAIN DB)
    // Note: In a pure multi-tenant setup, this might be 0 if all data is in tenant DBs.
    // For now, keeping as is, but acknowledging it might need a multi-DB aggregation loop.
    const totalCustomers = await Customer.countDocuments({ isDeleted: { $ne: true } });
    const totalLoans = await Loan.countDocuments({ isDeleted: { $ne: true } });

    const revenueStats = await Loan.aggregate([
        { $match: { isDeleted: { $ne: true }, status: { $in: ["APPROVED", "DISBURSED"] } } },
        { $group: { _id: null, totalVolume: { $sum: "$principalAmount" } } }
    ]);

    return {
        totalBanks,
        totalCustomers,
        totalLoans,
        totalVolume: revenueStats.length > 0 ? revenueStats[0].totalVolume : 0
    };
};

exports.getBankStats = async (bankId, models = null) => {
    // Determine which models to use (tenant-specific or global)
    const Branch = models && models.Branch ? models.Branch : require("../branches/branch.model");
    const CustomerModel = models && models.Customer ? models.Customer : Customer;
    const LoanModel = models && models.Loan ? models.Loan : Loan;

    const mongoose = require("mongoose");
    const bid = bankId.toString();
    const oidBankId = new mongoose.Types.ObjectId(bid);

    // Build query that is robust against string/ObjectId mismatches and legacy data
    // In a dedicated tenant DB, we could even omit the bankId filter, but keeping it for safety.
    const baseQuery = { 
        $or: [
            { bankId: bid },
            { bankId: oidBankId }
        ],
        isDeleted: { $ne: true } 
    };

    // If we're sure this is a tenant-specific connection, we can be even more lenient
    // because all data in that connection belongs to this bank.
    const tenantQuery = { isDeleted: { $ne: true } };
    const query = models ? tenantQuery : baseQuery;

    const totalBranches = await Branch.countDocuments(query);
    const totalCustomers = await CustomerModel.countDocuments(query);
    const totalLoans = await LoanModel.countDocuments(query);

    const collectionStats = await LoanModel.aggregate([
        { $match: query },
        { $match: { status: { $in: ["APPROVED", "DISBURSED"] } } },
        { $group: { _id: null, totalDisbursed: { $sum: "$principalAmount" } } }
    ]);

    // Fetch bank profile from MAIN DB
    const bank = await Bank.findById(oidBankId).select("name logo");

    return {
        bankName: bank?.name || "Institution Registry",
        bankLogo: bank?.logo || "",
        totalBranches,
        totalCustomers,
        totalLoans,
        totalDisbursed: collectionStats.length > 0 ? collectionStats[0].totalDisbursed : 0
    };
};
