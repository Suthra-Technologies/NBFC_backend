const Bank = require("../bank/bank.model");
const User = require("../users/user.model");
const Loan = require("../loans/loan.model");
const Customer = require("../customers/customer.model");
const Role = require("../roles/role.model");

exports.getPlatformStats = async () => {
    const totalBanks = await Bank.countDocuments({ isDeleted: false });

    // Total customers across all banks
    const totalCustomers = await Customer.countDocuments({ isDeleted: false });

    // Total loans across all banks
    const totalLoans = await Loan.countDocuments({ isDeleted: false });

    // Simplified Revenue: Sum of all approved loan amounts? 
    // Or sum of interest? Let's go with approved loan sum for now.
    const revenueStats = await Loan.aggregate([
        { $match: { isDeleted: false, status: "APPROVED" } },
        { $group: { _id: null, totalVolume: { $sum: "$amount" } } }
    ]);

    return {
        totalBanks,
        totalCustomers,
        totalLoans,
        totalVolume: revenueStats.length > 0 ? revenueStats[0].totalVolume : 0
    };
};

exports.getBankStats = async (bankId) => {
    const totalBranches = await require("../branches/branch.model").countDocuments({ bankId, isDeleted: false });
    const totalCustomers = await Customer.countDocuments({ bankId, isDeleted: false });
    const totalLoans = await Loan.countDocuments({ bankId, isDeleted: false });

    const collectionStats = await Loan.aggregate([
        { $match: { bankId, isDeleted: false, status: "APPROVED" } },
        { $group: { _id: null, totalDisbursed: { $sum: "$amount" } } }
    ]);

    return {
        totalBranches,
        totalCustomers,
        totalLoans,
        totalDisbursed: collectionStats.length > 0 ? collectionStats[0].totalDisbursed : 0
    };
};
