const loanService = require("./loan.service");

exports.createLoan = async (req, res, next) => {
    try {
        const bankId = req.user.bankId;
        let branchId = req.user.branchId;

        // If Bank Admin, they can specify the branch
        if (req.user.role === "BANK_ADMIN" && req.body.branchId) {
            branchId = req.body.branchId;
        }

        if (!bankId || !branchId) {
            return res.status(400).json({ message: "User must be assigned to branch or specify a branch to create loan" });
        }

        const loan = await loanService.createLoan(req.body, bankId, branchId, req.models);
        res.status(201).json({ success: true, data: loan });
    } catch (err) {
        next(err);
    }
};

exports.getAllLoans = async (req, res, next) => {
    try {
        let query = { bankId: req.user.bankId };

        if (req.user.role === "BRANCH_MANAGER" || req.user.role === "EMPLOYEE") {
            query.branchId = req.user.branchId;
        }

        if (req.query.status) query.status = req.query.status;
        if (req.query.customerId) query.customerId = req.query.customerId;

        const loans = await loanService.getAllLoans(query, req.models);
        res.status(200).json({ success: true, data: loans });
    } catch (err) {
        next(err);
    }
};

exports.getLoanById = async (req, res, next) => {
    try {
        const loan = await loanService.getLoanById(req.params.id, req.user.bankId, req.models);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        res.status(200).json({ success: true, data: loan });
    } catch (err) {
        next(err);
    }
};

exports.approveLoan = async (req, res, next) => {
    try {
        const loan = await loanService.updateStatus(req.params.id, "APPROVED", req.user._id, req.user.bankId, req.models);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        res.status(200).json({ success: true, data: loan, message: "Loan approved" });
    } catch (err) {
        next(err);
    }
};

exports.rejectLoan = async (req, res, next) => {
    try {
        const loan = await loanService.updateStatus(req.params.id, "REJECTED", req.user._id, req.user.bankId, req.models);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        res.status(200).json({ success: true, data: loan, message: "Loan rejected" });
    } catch (err) {
        next(err);
    }
};

exports.disburseLoan = async (req, res, next) => {
    try {
        const loan = await loanService.updateStatus(req.params.id, "DISBURSED", req.user._id, req.user.bankId, req.models);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        res.status(200).json({ success: true, data: loan, message: "Loan disbursed" });
    } catch (err) {
        next(err);
    }
};
