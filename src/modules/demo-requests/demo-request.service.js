const DemoRequest = require("./demo-request.model");

const createDemoRequest = async (data) => {
  const demoRequest = new DemoRequest(data);
  return await demoRequest.save();
};

const getAllDemoRequests = async (query = {}) => {
  return await DemoRequest.find(query).sort({ createdAt: -1 });
};

const getDemoRequestById = async (id) => {
  return await DemoRequest.findById(id);
};

const updateDemoRequest = async (id, data) => {
  return await DemoRequest.findByIdAndUpdate(id, data, { new: true });
};

const markAsRead = async (id) => {
  return await DemoRequest.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

const deleteDemoRequest = async (id) => {
  return await DemoRequest.findByIdAndDelete(id);
};

const getUnreadCount = async () => {
    return await DemoRequest.countDocuments({ isRead: false });
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
