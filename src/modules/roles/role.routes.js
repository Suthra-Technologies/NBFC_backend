const express = require("express");
const router = express.Router();
const controller = require("./role.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role Management
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             code: BRANCH_MANAGER
 *             name: Branch Manager
 *             permissions:
 *               - CREATE_LOAN
 *               - APPROVE_LOAN
 *               - VIEW_REPORTS
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 code: BRANCH_MANAGER
 *                 name: Branch Manager
 *                 permissions:
 *                   - CREATE_LOAN
 *                   - APPROVE_LOAN
 *                   - VIEW_REPORTS
 */
router.post("/", authMiddleware, controller.createRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - code: SUPER_ADMIN
 *                   name: Super Admin
 *                   permissions:
 *                     - ALL_ACCESS
 *                 - code: LOAN_OFFICER
 *                   name: Loan Officer
 *                   permissions:
 *                     - CREATE_LOAN
 */
router.get("/", authMiddleware, controller.getRoles);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update role permissions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             permissions:
 *               - CREATE_LOAN
 *               - VIEW_LOAN
 *     responses:
 *       200:
 *         description: Role permissions updated successfully
 */
router.put("/:id", authMiddleware, controller.updateRolePermissions);

module.exports = router;