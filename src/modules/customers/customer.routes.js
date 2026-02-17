const express = require("express");
const router = express.Router();
const controller = require("./customer.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management API
 */

router.post(
    "/",
    authMiddleware,
    hasPermission(PERMISSIONS.CREATE_CUSTOMER),
    controller.createCustomer
);

router.get(
    "/",
    authMiddleware,
    hasPermission(PERMISSIONS.VIEW_ALL_CUSTOMERS),
    controller.getAllCustomers
);

router.get(
    "/:id",
    authMiddleware,
    hasPermission(PERMISSIONS.VIEW_CUSTOMER_DETAILS),
    controller.getCustomerById
);

router.put(
    "/:id",
    authMiddleware,
    hasPermission(PERMISSIONS.UPDATE_CUSTOMER),
    controller.updateCustomer
);

router.delete(
    "/:id",
    authMiddleware,
    hasPermission(PERMISSIONS.UPDATE_CUSTOMER), // Usually manager/admin permission
    controller.deleteCustomer
);

module.exports = router;
