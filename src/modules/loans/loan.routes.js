const express = require("express");
const router = express.Router();
const controller = require("./loan.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management API
 */

router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.CREATE_LOAN),
    controller.createLoan
);

router.get(
    "/",
    authMiddleware,
    requirePermission(permissions.VIEW_LOAN),
    controller.getAllLoans
);

router.get(
    "/:id",
    authMiddleware,
    requirePermission(permissions.VIEW_LOAN),
    controller.getLoanById
);

router.patch(
    "/:id/approve",
    authMiddleware,
    requirePermission(permissions.APPROVE_LOAN),
    controller.approveLoan
);

router.patch(
    "/:id/reject",
    authMiddleware,
    requirePermission(permissions.APPROVE_LOAN),
    controller.rejectLoan
);

router.patch(
    "/:id/disburse",
    authMiddleware,
    requirePermission(permissions.APPROVE_LOAN),
    controller.disburseLoan
);

module.exports = router;
