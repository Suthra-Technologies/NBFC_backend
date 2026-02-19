const express = require("express");
const router = express.Router();
const controller = require("./bank.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

/**
 * @swagger
 * components:
 *   schemas:
 *     Bank:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - address
 *         - adminName
 *         - adminEmail
 *         - adminPassword
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         bankId:
 *           type: string
 *           description: Unique Bank ID
 *         name:
 *           type: string
 *           description: Name of the bank
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the bank
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         logo:
 *           type: string
 *           description: URL or path to the bank logo
 *         maxBranches:
 *           type: integer
 *           description: Maximum number of branches allowed (default 3)
 *         address:
 *           type: object
 *           properties:
 *             line1:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             pincode:
 *               type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *           default: ACTIVE
 *         subscriptionPlan:
 *           type: string
 *           enum: [BASIC, PRO, ENTERPRISE]
 *           default: BASIC
 *         subscriptionExpiry:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "Global Finance Bank"
 *         email: "contact@globalfinance.com"
 *         phone: "+1-555-0123"
 *         logo: "https://example.com/logo.png"
 *         maxBranches: 5
 *         address:
 *           line1: "123 Financial District"
 *           city: "New York"
 *           state: "NY"
 *           pincode: "10005"
 *         adminName: "John Doe"
 *         adminEmail: "admin@globalfinance.com"
 *         adminMobile: "+1-555-0987"
 *         adminPassword: "SecurePassword123!"
 */

/**
 * @swagger
 * tags:
 *   name: Banks
 *   description: Bank management API
 */

/**
 * @swagger
 * /banks:
 *   post:
 *     summary: Create a new bank
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - address
 *               - adminName
 *               - adminEmail
 *               - adminPassword
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               logo:
 *                 type: string
 *                 description: URL or path to the bank logo
 *               maxBranches:
 *                 type: integer
 *                 description: Maximum number of branches allowed
 *               address:
 *                 type: object
 *                 properties:
 *                   line1:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               adminName:
 *                 type: string
 *               adminEmail:
 *                 type: string
 *               adminMobile:
 *                 type: string
 *               adminPassword:
 *                 type: string
 *             example:
 *               name: "Global Finance Bank"
 *               email: "contact@globalfinance.com"
 *               phone: "+1-555-0123"
 *               logo: "https://example.com/logo.png"
 *               maxBranches: 5
 *               address:
 *                 line1: "123 Financial District"
 *                 city: "New York"
 *                 state: "NY"
 *                 pincode: "10005"
 *               adminName: "John Doe"
 *               adminEmail: "admin@globalfinance.com"
 *               adminMobile: "+1-555-0987"
 *               adminPassword: "SecurePassword123!"
 *     responses:
 *       201:
 *         description: Bank created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.CREATE_BANK),
    controller.createBank
);

router.get(
    "/",
    authMiddleware,
    requirePermission(permissions.VIEW_BANK),
    controller.getAllBanks
);

router.get(
    "/:id",
    authMiddleware,
    requirePermission(permissions.VIEW_BANK),
    controller.getBankById
);

router.put(
    "/:id",
    authMiddleware,
    requirePermission(permissions.SUSPEND_BANK),
    controller.updateBank
);

router.patch(
    "/:id/status",
    authMiddleware,
    requirePermission(permissions.SUSPEND_BANK),
    controller.updateBank
);

router.delete(
    "/:id",
    authMiddleware,
    requirePermission(permissions.SUSPEND_BANK),
    controller.deleteBank
);

module.exports = router;