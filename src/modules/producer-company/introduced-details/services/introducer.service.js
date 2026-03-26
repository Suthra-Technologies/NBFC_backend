const IntroducerMain = require("../models/introducer.model");

class IntroducerService {
    /**
     * Create a new introducer/freelance employee
     */
    async createIntroducer(data, bankId, branchId, models = null) {
        const Introducer = models?.Introducer || IntroducerMain;

        // Generate Unique Introducer ID
        const count = await Introducer.countDocuments({ bankId });
        const introducerId = `INT${(count + 1).toString().padStart(6, '0')}`;

        const introducerData = {
            ...data,
            introducerId,
            bankId,
            branchId,
            status: 'ACTIVE',
            isDeleted: false
        };

        const introducer = new Introducer(introducerData);
        return await introducer.save();
    }

    /**
     * Get introducer by ID
     */
    async getIntroducerById(introducerId, bankId, models = null) {
        const Introducer = models?.Introducer || IntroducerMain;
        return await Introducer.findOne({ introducerId, bankId, isDeleted: false });
    }

    /**
     * List all introducers for a bank
     */
    async getAllIntroducers(bankId, query = {}, models = null) {
        const Introducer = models?.Introducer || IntroducerMain;
        return await Introducer.find({ ...query, bankId, isDeleted: false })
            .select("-__v -isDeleted")
            .sort({ createdAt: -1 });
    }

    /**
     * Update introducer details
     */
    async updateIntroducer(introducerId, updateData, bankId, models = null) {
        const Introducer = models?.Introducer || IntroducerMain;
        return await Introducer.findOneAndUpdate(
            { introducerId, bankId },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    /**
     * Soft delete/deactivate introducer
     */
    async deleteIntroducer(introducerId, bankId, models = null) {
        const Introducer = models?.Introducer || IntroducerMain;
        return await Introducer.findOneAndUpdate(
            { introducerId, bankId },
            { $set: { isDeleted: true, status: 'INACTIVE' } },
            { new: true }
        );
    }
}

module.exports = new IntroducerService();
