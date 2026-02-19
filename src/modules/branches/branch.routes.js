const express = require("express");
const router = express.Router();
const controller = require("./branch.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       required:
 *         - branchCode
 *         - bankId
 *         - name
 *         - address
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         branchCode:
 *           type: string
 *           description: Unique Branch Code
 *         bankId:
 *           type: string
 *           description: ID of the bank this branch belongs to
 *         name:
 *           type: string
 *           description: Name of the branch
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
 *         managerId:
 *           type: string
 *           description: ID of the branch manager (User)
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           default: ACTIVE
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         branchCode: "BR-12345678"
 *         bankId: "60d0fe4f5311236168a109ca"
 *         name: "Downtown Branch"
 *         address:
 *           line1: "456 Main St"
 *           city: "Metropolis"
 *           state: "NY"
 *           pincode: "10001"
 *         status: "ACTIVE"
 */

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Branch management API
 */

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
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
 *               - address
 *             properties:
 *               bankId:
 *                 type: string
 *                 description: Required if Super Admin is creating the branch
 *               name:
 *                 type: string
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
 *               manager:
 *                 type: object
 *                 description: Optional manager details to create a new manager user
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   mobile:
 *                     type: string
 *                   password:
 *                     type: string
 *             example:
 *               name: "Downtown Branch"
 *               address:
 *                 line1: "456 Main St"
 *                 city: "Metropolis"
 *                 state: "NY"
 *                 pincode: "10001"
 *               manager:
 *                 fullName: "Jane Smith"
 *                 email: "jane.smith@bank.com"
 *                 mobile: "+1-555-9876"
 *                 password: "ManagerPassword123!"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Bad request or limit reached
 *       403:
 *         description: Access denied
 */
router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.CREATE_BRANCH),
    controller.createBranch
);

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all branches (for the logged-in bank admin's bank)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 */
router.get(
    "/",
    authMiddleware,
    requirePermission(permissions.VIEW_BRANCH),
    controller.getAllBranches
);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The branch ID
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 */
router.get(
    "/:id",
    authMiddleware,
    requirePermission(permissions.VIEW_BRANCH),
    controller.getBranchById
);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Update a branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
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
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 */
router.put(
    "/:id",
    authMiddleware,
    requirePermission(permissions.CREATE_BRANCH),
    controller.updateBranch
);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Soft delete a branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The branch ID
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 */
router.delete(
    "/:id",
    authMiddleware,
    requirePermission(permissions.CREATE_BRANCH),
    controller.deleteBranch
);

module.exports = router;
