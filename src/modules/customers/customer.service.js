const CustomerMain = require("./customer.model");
const { randomUUID } = require("crypto");

exports.createCustomer = async (data, bankId, branchId, models = null) => {
    const Customer = models && models.Customer ? models.Customer : CustomerMain;
    return await Customer.create({
        customerId: "CST-" + randomUUID().slice(0, 8),
        bankId,
        branchId,
        ...data
    });
};

exports.getAllCustomers = async (query = {}, models = null) => {
    const Customer = models && models.Customer ? models.Customer : CustomerMain;
    return await Customer.find({ ...query, isDeleted: false })
        .populate("bankId", "name")
        .populate("branchId", "name");
};

exports.getCustomerById = async (id, bankId = null, models = null) => {
    const Customer = models && models.Customer ? models.Customer : CustomerMain;
    const query = { _id: id, isDeleted: false };
    if (bankId) query.bankId = bankId;
    return await Customer.findOne(query).populate("bankId branchId");
};

exports.updateCustomer = async (id, data, bankId = null, models = null) => {
    const Customer = models && models.Customer ? models.Customer : CustomerMain;
    const query = { _id: id, isDeleted: false };
    if (bankId) query.bankId = bankId;
    return await Customer.findOneAndUpdate(query, data, { new: true });
};

exports.deleteCustomer = async (id, bankId = null, models = null) => {
    const Customer = models && models.Customer ? models.Customer : CustomerMain;
    const query = { _id: id };
    if (bankId) query.bankId = bankId;
    return await Customer.findOneAndUpdate(query, { isDeleted: true }, { new: true });
};

