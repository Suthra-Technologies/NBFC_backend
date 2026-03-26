const express = require("express");
const router = express.Router();
const introducerController = require("../controllers/introducer.controller");
const introducerValidation = require("../validations/introducer.validation");
const upload = require("../../../../middlewares/upload.middleware");
const authMiddleware = require("../../../../middlewares/auth.middleware");

/**
 * @route   POST /api/producer-company/introducers
 * @desc    Register a new freelance employee/introducer
 * @access  Private
 */
router.post(
    "/",
    authMiddleware,
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'signature', maxCount: 1 }
    ]),
    introducerValidation.validateIntroducerCreate,
    introducerController.createIntroducer
);

/**
 * @route   GET /api/producer-company/introducers
 * @desc    Get all introducers for the authenticated bank context
 */
router.get(
    "/",
    authMiddleware,
    introducerController.getAllIntroducers
);

/**
 * @route   GET /api/producer-company/introducers/:introducerId
 * @desc    Get specific introducer details
 */
router.get(
    "/:introducerId",
    authMiddleware,
    introducerController.getIntroducerById
);

/**
 * @route   PATCH /api/producer-company/introducers/:introducerId
 * @desc    Update existing introducer record
 */
router.patch(
    "/:introducerId",
    authMiddleware,
    introducerValidation.validateIntroducerUpdate,
    introducerController.updateIntroducer
);

/**
 * @route   DELETE /api/producer-company/introducers/:introducerId
 * @desc    Deactivate an introducer record
 */
router.delete(
    "/:introducerId",
    authMiddleware,
    introducerController.deleteIntroducer
);

module.exports = router;
