const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         roleId:
 *           type: string
 *         bankId:
 *           type: string
 *         branchId:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Staff/Manager/Borrower)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, mobile, password, roleId]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               mobile: { type: string }
 *               password: { type: string }
 *               roleId: { type: string }
 *               bankId: { type: string, description: "Required for Super Admin" }
 *               branchId: { type: string }
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Permission denied
 */
router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.CREATE_USER),
    controller.createUser
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Scoped by bank for non-Super Admins)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *         description: Role code (e.g. BANK_ADMIN)
 *       - in: query
 *         name: branchId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
    "/",
    authMiddleware,
    requirePermission(permissions.VIEW_USER),
    controller.getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 */
router.get(
    "/:id",
    authMiddleware,
    requirePermission(permissions.VIEW_USER),
    controller.getUserById
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details or status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 */
router.put(
    "/:id",
    authMiddleware,
    requirePermission(permissions.CREATE_USER),
    controller.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
    "/:id",
    authMiddleware,
    requirePermission(permissions.CREATE_USER), // Reusing CREATE_USER as management permission
    controller.deleteUser
);

module.exports = router;