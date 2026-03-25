const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shares.controller");
const authenticate = require("../../../../middlewares/auth.middleware");

// All routes require authentication
router.use(authenticate);

router.post("/", shareController.createShareIssue);
router.get("/", shareController.getAllShareIssues);
router.get("/:id", shareController.getShareIssueById);

module.exports = router;
