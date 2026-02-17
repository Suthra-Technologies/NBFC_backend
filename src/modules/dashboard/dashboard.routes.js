const express = require("express");
const router = express.Router();
const controller = require("./dashboard.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Analytics and summaries
 */

/**
 * @swagger
 * /dashboard/platform:
 *   get:
 *     summary: Super Admin Platform Stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform stats
 */
router.get(
    "/platform",
    authMiddleware,
    hasPermission(PERMISSIONS.VIEW_PLATFORM_DASHBOARD),
    controller.getPlatformDashboard
);

/**
 * @swagger
 * /dashboard/bank:
 *   get:
 *     summary: Bank Admin Overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank stats
 */
router.get(
    "/bank",
    authMiddleware,
    hasPermission(PERMISSIONS.VIEW_BANK_REPORTS),
    controller.getBankDashboard
);

module.exports = router;
