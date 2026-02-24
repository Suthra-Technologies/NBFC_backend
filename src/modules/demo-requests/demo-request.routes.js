const express = require("express");
const router = express.Router();
const controller = require("./demo-request.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: DemoRequests
 *   description: Demo request management API
 */

/**
 * @swagger
 * /demo-requests:
 *   post:
 *     summary: Book a new demo
 *     tags: [DemoRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, organization]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               organization: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Demo request created
 */
router.post("/", controller.createDemoRequest);

/**
 * @swagger
 * /demo-requests:
 *   get:
 *     summary: Get all demo requests
 *     tags: [DemoRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of demo requests
 */
router.get("/", authMiddleware, controller.getAllDemoRequests);

/**
 * @swagger
 * /demo-requests/unread-count:
 *   get:
 *     summary: Get unread demo requests count
 *     tags: [DemoRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 */
router.get("/unread-count", authMiddleware, controller.getUnreadCount);

/**
 * @swagger
 * /demo-requests/{id}:
 *   get:
 *     summary: Get demo request by ID
 *     tags: [DemoRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demo request details
 */
router.get("/:id", authMiddleware, controller.getDemoRequestById);

/**
 * @swagger
 * /demo-requests/{id}:
 *   put:
 *     summary: Update demo request
 *     tags: [DemoRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demo request updated
 */
router.put("/:id", authMiddleware, controller.updateDemoRequest);

/**
 * @swagger
 * /demo-requests/{id}/read:
 *   patch:
 *     summary: Mark demo request as read
 *     tags: [DemoRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demo request marked as read
 */
router.patch("/:id/read", authMiddleware, controller.markAsRead);

/**
 * @swagger
 * /demo-requests/{id}:
 *   delete:
 *     summary: Delete demo request
 *     tags: [DemoRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demo request deleted
 */
router.delete("/:id", authMiddleware, controller.deleteDemoRequest);

module.exports = router;
