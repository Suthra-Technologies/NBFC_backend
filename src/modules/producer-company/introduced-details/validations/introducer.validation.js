const { body } = require('express-validator');

exports.validateIntroducerCreate = [
    // Particulars
    body('postAppliedFor').notEmpty().withMessage('Post Applied For is required'),
    body('employeeName').notEmpty().withMessage('Employee Name is required').trim(),
    body('mobileNo').matches(/^[6-9]\d{9}$/).withMessage('Invalid 10-digit mobile number'),
    body('gender').optional().isIn(['Male', 'Female', 'Other', 'Select']),
    body('dob').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid DOB'),
    
    // Family details
    body('nominee.name').optional().trim(),
    body('nominee.mobileNo').optional({ checkFalsy: true }).matches(/^[6-9]\d{9}$/).withMessage('Invalid 10-digit nominee mobile number'),

    // Bank details
    body('bankAccount.bankName').optional().trim(),
    body('bankAccount.accountNo').optional().trim(),
];

exports.validateIntroducerUpdate = [
    body('employeeName').optional().trim(),
    body('mobileNo').optional().matches(/^[6-9]\d{9}$/),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'PENDING']),
];
