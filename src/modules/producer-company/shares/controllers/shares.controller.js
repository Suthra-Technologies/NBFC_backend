const shareService = require("../services/shares.service");
const logger = require("../../../../utils/logger");

const shareController = {
  createShareIssue: async (req, res) => {
    try {
      const { bankId, branchId } = req.user || {};
      const context = { bankId, branchId };
      const models = req.models; // Tenant models from middleware
      
      const shareIssue = await shareService.createShareIssue(req.body, context, models);
      
      res.status(201).json({
        success: true,
        data: shareIssue,
        message: "Share issued successfully",
      });
    } catch (error) {
      logger.error("Error creating share issue:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to issue shares",
      });
    }
  },

  getAllShareIssues: async (req, res) => {
    try {
      const { bankId } = req.user || {};
      const context = { bankId };
      const models = req.models;
      const filters = {}; 
      
      const shareIssues = await shareService.getAllShareIssues(filters, context, models);
      
      res.status(200).json({
        success: true,
        data: shareIssues,
        count: shareIssues.length,
      });
    } catch (error) {
      logger.error("Error fetching share issues:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch share issues",
      });
    }
  },

  getShareIssueById: async (req, res) => {
    try {
      const models = req.models;
      const shareIssue = await shareService.getShareIssueById(req.params.id, models);
      if (!shareIssue) {
        return res.status(404).json({
          success: false,
          message: "Share issue not found",
        });
      }
      res.status(200).json({
        success: true,
        data: shareIssue,
      });
    } catch (error) {
      logger.error("Error fetching share issue detail:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch share issue details",
      });
    }
  },
};

module.exports = shareController;
