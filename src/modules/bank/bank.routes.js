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
 *         subdomain:
 *           type: string
 *           description: Unique subdomain for the bank portal
 *         dbName:
 *           type: string
 *           description: Dedicated database name for this bank
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
 *         subdomain: "globalfin"
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
 *               subdomain:
 *                 type: string
 *                 description: Unique subdomain for the bank portal (optional, generated from name if omitted)
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
 *               branchName:
 *                 type: string
 *                 description: Name of the initial primary branch
 *               branchCode:
 *                 type: string
 *                 description: Unique code for the initial primary branch
 *             example:
 *               name: "Global Finance Bank"
 *               email: "contact@globalfinance.com"
 *               phone: "+1-555-0123"
 *               logo: "https://example.com/logo.png"
 *               maxBranches: 5
 *               subdomain: "globalfin"
 *               address:
 *                 line1: "123 Financial District"
 *                 city: "New York"
 *                 state: "NY"
 *                 pincode: "10005"
 *               adminName: "John Doe"
 *               adminEmail: "admin@globalfinance.com"
 *               adminMobile: "+1-555-0987"
 *               adminPassword: "SecurePassword123!"
 *               branchName: "Head Office"
 *               branchCode: "HO001"
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
/**
 * @swagger
 * /banks/tenant-info:
 *   get:
 *     summary: Get bank info from subdomain (Public)
 *     tags: [Banks]
 *     description: Automatically detects bank based on subdomain in host header
 *     responses:
 *       200:
 *         description: Tenant information
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 name: "Global Finance Bank"
 *                 logo: "https://example.com/logo.png"
 *                 subdomain: "globalfin"
 *       404:
 *         description: Bank not found for this subdomain
 */
router.get(
    "/tenant-info",
    controller.getTenantInfo
);

router.get(
    "/profile",
    authMiddleware,
    controller.getMyBank
);

const { body } = require("express-validator");
const validate = require("../../middlewares/validate.middleware");

// 5. Injection - Validate and sanitize bank creation inputs
router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.CREATE_BANK),
    [
        body("name").notEmpty().withMessage("Bank name is required").trim().escape(),
        body("email").isEmail().withMessage("Valid bank email is required").normalizeEmail(),
        body("adminEmail").isEmail().withMessage("Valid admin email is required").normalizeEmail(),
        body("adminPassword").isLength({ min: 8 }).withMessage("Admin password must be at least 8 characters long"),
        body("subdomain").optional().matches(/^[a-z0-9-]+$/).withMessage("Subdomain must be lowercase alphanumeric with hyphens only"),
    ],
    validate,
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