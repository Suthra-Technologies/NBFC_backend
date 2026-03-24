const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const memberValidation = require("../validations/member.validation");
const upload = require("../../../../middlewares/upload.middleware");

const authMiddleware = require("../../../../middlewares/auth.middleware");

/**
 * @route   POST /api/producer-company/members
 * @desc    Register a new member
 * @access  Private
 */
router.post(
    "/",
    authMiddleware,
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
        { name: 'idProof', maxCount: 1 },
        { name: 'addressProof', maxCount: 1 },
        { name: 'otherDocument', maxCount: 1 }
    ]),
    memberValidation.validateMemberCreate,
    memberController.createMember
);

/**
 * @route   GET /api/producer-company/members
 * @desc    Get all members for the authenticated bank context
 * @access  Private
 */
router.get(
    "/",
    authMiddleware,
    memberController.getAllMembers
);

/**
 * @route   GET /api/producer-company/members/:memberId
 * @desc    Get specific member details by Application ID
 * @access  Private
 */
router.get(
    "/:memberId",
    authMiddleware,
    memberController.getMemberById
);

/**
 * @route   PATCH /api/producer-company/members/:memberId
 * @desc    Update existing member record
 * @access  Private
 */
router.patch(
    "/:memberId",
    authMiddleware,
    memberValidation.validateMemberUpdate,
    memberController.updateMember
);

/**
 * @route   DELETE /api/producer-company/members/:memberId
 * @desc    Soft-delete/Deactivate a member record
 * @access  Private
 */
router.delete(
    "/:memberId",
    authMiddleware,
    memberController.deleteMember
);

module.exports = router;
