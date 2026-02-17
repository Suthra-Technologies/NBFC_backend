const dashboardService = require("./dashboard.service");

exports.getPlatformDashboard = async (req, res, next) => {
    try {
        const stats = await dashboardService.getPlatformStats();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};

exports.getBankDashboard = async (req, res, next) => {
    try {
        const stats = await dashboardService.getBankStats(req.user.bankId);
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};
