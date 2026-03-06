const { validationResult } = require("express-validator");

/**
 * 5. Injection - Standard middleware to handle validation results from express-validator.
 * Fail fast if input doesn't match the required schema.
 */
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};
