const express = require("express");
const router = express.Router();
const controller = require("./customer.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management API
 */

router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.CREATE_CUSTOMER),
    controller.createCustomer
);

router.get(
    "/",
    authMiddleware,
    requirePermission(permissions.VIEW_CUSTOMER),
    controller.getAllCustomers
);

router.get(
    "/:id",
    authMiddleware,
    requirePermission(permissions.VIEW_CUSTOMER),
    controller.getCustomerById
);

router.put(
    "/:id",
    authMiddleware,
    requirePermission(permissions.CREATE_CUSTOMER),
    controller.updateCustomer
);

router.delete(
    "/:id",
    authMiddleware,
    requirePermission(permissions.CREATE_CUSTOMER), // Usually manager/admin permission
    controller.deleteCustomer
);

module.exports = router;
