const demoRequestService = require("./demo-request.service");

const createDemoRequest = async (req, res, next) => {
  try {
    const demoRequest = await demoRequestService.createDemoRequest(req.body);
    res.status(201).json({
      success: true,
      data: demoRequest,
      message: "Demo request booked successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllDemoRequests = async (req, res, next) => {
  try {
    const demoRequests = await demoRequestService.getAllDemoRequests();
    res.status(200).json({
      success: true,
      data: demoRequests,
    });
  } catch (error) {
    next(error);
  }
};

const getDemoRequestById = async (req, res, next) => {
  try {
    const demoRequest = await demoRequestService.getDemoRequestById(req.params.id);
    if (!demoRequest) {
      return res.status(404).json({ success: false, message: "Demo request not found" });
    }
    res.status(200).json({
      success: true,
      data: demoRequest,
    });
  } catch (error) {
    next(error);
  }
};

const updateDemoRequest = async (req, res, next) => {
  try {
    const demoRequest = await demoRequestService.updateDemoRequest(req.params.id, req.body);
    if (!demoRequest) {
      return res.status(404).json({ success: false, message: "Demo request not found" });
    }
    res.status(200).json({
      success: true,
      data: demoRequest,
      message: "Demo request updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const demoRequest = await demoRequestService.markAsRead(req.params.id);
    if (!demoRequest) {
      return res.status(404).json({ success: false, message: "Demo request not found" });
    }
    res.status(200).json({
      success: true,
      data: demoRequest,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDemoRequest = async (req, res, next) => {
  try {
    const demoRequest = await demoRequestService.deleteDemoRequest(req.params.id);
    if (!demoRequest) {
      return res.status(404).json({ success: false, message: "Demo request not found" });
    }
    res.status(200).json({
      success: true,
      message: "Demo request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const count = await demoRequestService.getUnreadCount();
        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
  createDemoRequest,
  getAllDemoRequests,
  getDemoRequestById,
  updateDemoRequest,
  markAsRead,
  deleteDemoRequest,
  getUnreadCount
};
