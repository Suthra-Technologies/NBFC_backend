const Customer = require("./customer.model");
const { randomUUID } = require("crypto");

exports.createCustomer = async (data, bankId, branchId) => {
    return await Customer.create({
        customerId: "CST-" + randomUUID().slice(0, 8),
        bankId,
        branchId,
        ...data
    });
};

exports.getAllCustomers = async (query = {}) => {
    return await Customer.find({ ...query, isDeleted: false })
        .populate("bankId", "name")
        .populate("branchId", "name");
};

exports.getCustomerById = async (id, bankId = null) => {
    const query = { _id: id, isDeleted: false };
    if (bankId) query.bankId = bankId;
    return await Customer.findOne(query).populate("bankId branchId");
};

exports.updateCustomer = async (id, data, bankId = null) => {
    const query = { _id: id, isDeleted: false };
    if (bankId) query.bankId = bankId;
    return await Customer.findOneAndUpdate(query, data, { new: true });
};

exports.deleteCustomer = async (id, bankId = null) => {
    const query = { _id: id };
    if (bankId) query.bankId = bankId;
    return await Customer.findOneAndUpdate(query, { isDeleted: true }, { new: true });
};
