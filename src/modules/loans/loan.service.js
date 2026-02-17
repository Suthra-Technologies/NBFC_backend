const Loan = require("./loan.model");
const { randomUUID } = require("crypto");

exports.createLoan = async (data, bankId, branchId) => {
    // Simple EMI Calculation logic can be added here
    const principal = data.principalAmount;
    const rate = data.interestRate / 100 / 12; // Monthly rate
    const months = data.tenureMonths;

    let emi;
    if (data.interestType === "REDUCING") {
        emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    } else {
        // Flat
        const totalInterest = (principal * (data.interestRate / 100) * (months / 12));
        emi = (principal + totalInterest) / months;
    }

    const totalPayable = emi * months;

    return await Loan.create({
        loanId: "LON-" + randomUUID().slice(0, 8),
        bankId,
        branchId,
        emiAmount: Math.round(emi),
        totalPayable: Math.round(totalPayable),
        totalInterest: Math.round(totalPayable - principal),
        outstandingAmount: Math.round(totalPayable),
        ...data
    });
};

exports.getAllLoans = async (query = {}) => {
    return await Loan.find({ ...query, isDeleted: false })
        .populate("customerId", "personalInfo")
        .populate("bankId", "name")
        .populate("branchId", "name");
};

exports.getLoanById = async (id, bankId = null) => {
    const query = { _id: id, isDeleted: false };
    if (bankId) query.bankId = bankId;
    return await Loan.findOne(query).populate("customerId bankId branchId");
};

exports.updateStatus = async (id, status, userId, bankId = null) => {
    const query = { _id: id, isDeleted: false };
    if (bankId) query.bankId = bankId;

    const update = { status };
    if (status === "APPROVED") {
        update.approvedBy = userId;
    } else if (status === "DISBURSED") {
        update.disbursedBy = userId;
        update.disbursedAt = new Date();
    }

    return await Loan.findOneAndUpdate(query, update, { new: true });
};
