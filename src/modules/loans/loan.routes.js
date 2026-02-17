const express = require("express");
const router = express.Router();
const controller = require("./loan.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management API
 */

router.post(
    "/",
    authMiddleware,
    hasPermission(PERMISSIONS.CREATE_LOAN),
    controller.createLoan
);

router.get(
    "/",
    authMiddleware,
    hasPermission(PERMISSIONS.VIEW_ALL_LOANS),
    controller.getAllLoans
);

router.get(
    "/:id",
    authMiddleware,
    hasPermission(PERMISSIONS.VIEW_LOAN_DETAILS),
    controller.getLoanById
);

router.patch(
    "/:id/approve",
    authMiddleware,
    hasPermission(PERMISSIONS.APPROVE_LOAN),
    controller.approveLoan
);

router.patch(
    "/:id/reject",
    authMiddleware,
    hasPermission(PERMISSIONS.REJECT_LOAN),
    controller.rejectLoan
);

router.patch(
    "/:id/disburse",
    authMiddleware,
    hasPermission([PERMISSIONS.APPROVE_LOAN, PERMISSIONS.COLLECT_EMI]), // Or specific DISBURSE permission
    controller.disburseLoan
);

module.exports = router;
