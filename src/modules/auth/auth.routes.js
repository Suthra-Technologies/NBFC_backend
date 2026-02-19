const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user. Access is restricted based on the subdomain (e.g., staff must login via their bank's subdomain).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@nbfc.com
 *             password: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   userId: USR-12345678
 *                   fullName: Super Admin
 *                   email: admin@nbfc.com
 *                   roleId: 65fcb1b2a8c123456789abcd
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", controller.login);

module.exports = router;