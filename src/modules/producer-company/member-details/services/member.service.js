const MemberMain = require("../models/member.model");

class MemberService {
    /**
     * Create a new member in the system
     * @param {Object} memberData - All required member details
     * @param {string} bankId - Associated Bank ID (SaaS isolation)
     * @param {string} branchId - Associated Branch ID
     * @returns {Promise<Object>} The created member object
     */
    async createMember(memberData, bankId, branchId, models = null) {
        const Member = models?.Member || MemberMain;

        // Generate Unique Member ID with padding
        const count = await Member.countDocuments({ bankId });
        const memberId = `MBR${(count + 1).toString().padStart(6, '0')}`;

        // Business logic: Synchronize addresses if "Same As Above" is checked
        if (memberData.sameAsPermanent && memberData.permanentAddress) {
            memberData.correspondenceAddress = { ...memberData.permanentAddress };
        }

        // Ensure critical fields are set via backend to prevent tampering
        const data = {
            ...memberData,
            memberId,
            bankId,
            branchId,
            status: 'ACTIVE',
            isDeleted: false
        };

        const member = new Member(data);
        return await member.save();
    }

    /**
     * Fetch member details by their unique application ID
     */
    async getMemberById(memberId, bankId, models = null) {
        const Member = models?.Member || MemberMain;
        return await Member.findOne({ memberId, bankId, isDeleted: false });
    }

    /**
     * Retrieve list of members for a bank with optional filters
     */
    async getAllMembers(bankId, query = {}, models = null) {
        const Member = models?.Member || MemberMain;
        return await Member.find({ ...query, bankId, isDeleted: false })
            .select("-__v -isDeleted")
            .sort({ createdAt: -1 });
    }

    /**
     * Update existing member record
     */
    async updateMember(memberId, updateData, bankId, models = null) {
        const Member = models?.Member || MemberMain;
        if (updateData.sameAsPermanent && updateData.permanentAddress) {
            updateData.correspondenceAddress = { ...updateData.permanentAddress };
        }
        
        return await Member.findOneAndUpdate(
            { memberId, bankId },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    /**
     * Perform a soft delete of a member record
     */
    async deleteMember(memberId, bankId, models = null) {
        const Member = models?.Member || MemberMain;
        return await Member.findOneAndUpdate(
            { memberId, bankId },
            { $set: { isDeleted: true, status: 'INACTIVE' } },
            { new: true }
        );
    }
}

module.exports = new MemberService();
