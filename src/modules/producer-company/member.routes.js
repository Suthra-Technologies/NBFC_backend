const express = require("express");
const router = express.Router();
const controller = require("./member.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/permission.middleware");
const permissions = require("../../constants/permissions");

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Producer Company Member management API
 */

// POST /api/producer-company/members - Create new member
router.post(
    "/",
    authMiddleware,
    requirePermission(permissions.MANAGE_PRODUCER_MEMBERS),
    controller.createMember
);

// GET /api/producer-company/members - List all members
router.get(
    "/",
    authMiddleware,
    requirePermission(permissions.MANAGE_PRODUCER_MEMBERS),
    controller.getAllMembers
);

// GET /api/producer-company/members/:memberId - Get single member
router.get(
    "/:memberId",
    authMiddleware,
    requirePermission(permissions.MANAGE_PRODUCER_MEMBERS),
    controller.getMemberById
);

// PUT /api/producer-company/members/:memberId - Update member
router.put(
    "/:memberId",
    authMiddleware,
    requirePermission(permissions.MANAGE_PRODUCER_MEMBERS),
    controller.updateMember
);

// DELETE /api/producer-company/members/:memberId - Soft delete member
router.delete(
    "/:memberId",
    authMiddleware,
    requirePermission(permissions.MANAGE_PRODUCER_MEMBERS),
    controller.deleteMember
);

module.exports = router;
