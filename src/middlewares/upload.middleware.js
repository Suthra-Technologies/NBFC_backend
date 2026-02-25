const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client } = require("../config/s3.config");
const { aws } = require("../config/env");
const path = require("path");

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: aws.bucket,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileName = `${Date.now()}_${path.basename(file.originalname)}`;
            cb(null, `uploads/${fileName}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png) and documents (pdf, doc, docx) are allowed!"));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
