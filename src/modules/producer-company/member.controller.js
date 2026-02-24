const memberService = require("./member.service");

exports.createMember = async (req, res, next) => {
    try {
        const bankId = req.user.bankId;
        let branchId = req.user.branchId;

        if (req.user.role === "BANK_ADMIN" && req.body.branchId) {
            branchId = req.body.branchId;
        }

        if (!bankId || !branchId) {
            return res.status(400).json({ message: "User must be assigned to a bank and branch" });
        }

        const member = await memberService.createMember(req.body, bankId, branchId);
        res.status(201).json({ success: true, data: member, message: "Member created successfully" });
    } catch (err) {
        next(err);
    }
};

exports.getAllMembers = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.memberType) query.memberType = req.query.memberType;
        if (req.query.status) query.status = req.query.status;
        if (req.query.mobile) query.mobile1 = req.query.mobile;

        const members = await memberService.getAllMembers(req.user.bankId, query);
        res.status(200).json({ success: true, data: members, count: members.length });
    } catch (err) {
        next(err);
    }
};

exports.getMemberById = async (req, res, next) => {
    try {
        const member = await memberService.getMemberById(req.params.memberId, req.user.bankId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ success: true, data: member });
    } catch (err) {
        next(err);
    }
};

exports.updateMember = async (req, res, next) => {
    try {
        const member = await memberService.updateMember(req.params.memberId, req.body, req.user.bankId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ success: true, data: member, message: "Member updated successfully" });
    } catch (err) {
        next(err);
    }
};

exports.deleteMember = async (req, res, next) => {
    try {
        const member = await memberService.deleteMember(req.params.memberId, req.user.bankId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ success: true, message: "Member deleted successfully" });
    } catch (err) {
        next(err);
    }
};
