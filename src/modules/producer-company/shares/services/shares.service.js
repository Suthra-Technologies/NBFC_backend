const SharesMain = require("../models/shares.model");

const shareService = {
  createShareIssue: async (data, context, models) => {
    const { bankId, branchId } = context;
    const Shares = models?.Shares || SharesMain;
    
    // 1. Calculate distinctive numbers
    const lastIssue = await Shares.findOne({ bankId }).sort({ distinctiveTo: -1 });
    const startFrom = lastIssue ? lastIssue.distinctiveTo + 1 : 1;
    const endTo = startFrom + Number(data.noOfSharesHeld) - 1;
    const distinctiveNos = `${startFrom} To ${endTo}`;

    const newIssue = new Shares({
      ...data,
      bankId,
      branchId,
      distinctiveFrom: startFrom,
      distinctiveTo: endTo,
      distinctiveNos,
      totalAmount: data.noOfSharesHeld * data.sharesEachOf,
    });

    return await newIssue.save();
  },

  getAllShareIssues: async (filters, context, models) => {
    const { bankId } = context;
    const Shares = models?.Shares || SharesMain;
    const query = { bankId, ...filters };
    return await Shares.find(query).populate("memberId").sort({ createdAt: -1 });
  },

  getShareIssueById: async (id, models) => {
    const Shares = models?.Shares || SharesMain;
    return await Shares.findById(id).populate("memberId");
  },
};

module.exports = shareService;
