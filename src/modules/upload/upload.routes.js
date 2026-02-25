const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload.middleware");
const { uploadFiles } = require("./upload.controller");

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload/single:
 *   post:
 *     summary: Upload a single image or document to S3
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (Image or Document)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     key:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                   
 *       400:
 *         description: Bad request (no file or unsupported format)
 *       500:
 *         description: Internal server error
 */
router.post("/single", upload.single("file"), uploadFiles);

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple images or documents to S3
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/multiple", upload.array("files", 5), uploadFiles);

module.exports = router;
