const express = require("express");
const router = express.Router();
const controller = require("./dashboard.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

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
    requirePermission(permissions.VIEW_REPORTS),
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
    requirePermission(permissions.VIEW_REPORTS),
    controller.getBankDashboard
);

module.exports = router;
