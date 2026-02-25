const express = require("express");
const router = express.Router();
const chatbotController = require("./chatbot.controller");
const auth = require("../../middlewares/auth.middleware");

// Assuming we want only authenticated users to use the chatbot
router.post("/", auth, chatbotController.handleChat);

module.exports = router;
