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

/**
 * @swagger
 * /api/producer-company/members:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
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
 *               - mobile1
 *               - gender
 *             properties:
 *               memberType:
 *                 type: string
 *                 enum: [MEMBER, ASSOCIATE]
 *               registrationDate:
 *                 type: string
 *                 format: date
 *               membershipFee:
 *                 type: number
 *               name:
 *                 type: string
 *               fatherHusbandName:
 *                 type: string
 *               motherName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               dob:
 *                 type: string
 *                 format: date
 *               age:
 *                 type: number
 *               occupation:
 *                 type: string
 *               aadharNo:
 *                 type: string
 *               panNo:
 *                 type: string
 *               mobile1:
 *                 type: string
 *               landline:
 *                 type: string
 *               alternateMobile:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               signatureUrl:
 *                 type: string
 *               permanentAddress:
 *                 $ref: '#/components/schemas/Address'
 *               correspondenceAddress:
 *                 $ref: '#/components/schemas/Address'
 *               sameAsPermanent:
 *                 type: boolean
 *               nominee:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   relation:
 *                     type: string
 *                   age:
 *                     type: number
 *                   mobileNo:
 *                     type: string
 *                   address:
 *                     $ref: '#/components/schemas/Address'
 *                   sameAsPermanent:
 *                     type: boolean
 *               kyc:
 *                 type: object
 *                 properties:
 *                   idProofType:
 *                     type: string
 *                   idProofUrl:
 *                     type: string
 *                   addressProofType:
 *                     type: string
 *                   addressProofUrl:
 *                     type: string
 *                   otherDocumentLabel:
 *                     type: string
 *                   otherDocumentUrl:
 *                     type: string
 *           example:
 *             memberType: "MEMBER"
 *             registrationDate: "2024-03-20"
 *             name: "JOHN DOE"
 *             fatherHusbandName: "RICHARD DOE"
 *             gender: "MALE"
 *             dob: "1990-01-01"
 *             age: 34
 *             mobile1: "9876543210"
 *             permanentAddress:
 *               houseNo: "123"
 *               area: "Main St"
 *               city: "Hyderabad"
 *               state: "TELANGANA"
 *               pincode: "500001"
 *             kyc:
 *               idProofType: "AADHAR CARD"
 *               idProofUrl: "https://example-bucket.s3.amazonaws.com/kyc/aadhar.jpg"
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
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
