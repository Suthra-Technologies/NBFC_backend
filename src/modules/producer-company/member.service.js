const Member = require("./member.model");

class MemberService {
    async createMember(memberData, bankId, branchId) {
        // Generate Member ID (In real app, this would be more complex)
        const count = await Member.countDocuments({ bankId });
        const memberId = `MBR${(count + 1).toString().padStart(5, '0')}`;
        
        const member = new Member({
            ...memberData,
            memberId,
            bankId,
            branchId
        });
        
        return await member.save();
    }

    async getMemberById(memberId, bankId) {
        return await Member.findOne({ memberId, bankId, isDeleted: false });
    }

    async getAllMembers(bankId, query = {}) {
        return await Member.find({ ...query, bankId, isDeleted: false }).sort({ createdAt: -1 });
    }

    async updateMember(memberId, updateData, bankId) {
        return await Member.findOneAndUpdate(
            { memberId, bankId },
            { $set: updateData },
            { new: true }
        );
    }

    async deleteMember(memberId, bankId) {
        return await Member.findOneAndUpdate(
            { memberId, bankId },
            { isDeleted: true }
        );
    }
}

module.exports = new MemberService();
