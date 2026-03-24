const { body } = require('express-validator');

exports.validateMemberCreate = [
    // Header
    body('memberType').optional().isIn(['MEMBER', 'ASSOCIATE']).withMessage('Invalid member type'),
    body('registrationDate').optional().isISO8601().withMessage('Invalid registration date'),
    body('membershipFee').optional().isNumeric().withMessage('Membership fee must be a number'),

    // Customer Details
    body('name').notEmpty().withMessage('Customer name is required').trim(),
    body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Invalid gender'),
    body('dob').isISO8601().optional({ checkFalsy: true }).withMessage('Invalid DOB'),
    body('aadharNo').optional({ checkFalsy: true }).isLength({ min: 12, max: 12 }).withMessage('Aadhar must be 12 digits'),
    body('panNo').optional({ checkFalsy: true }).matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN format'),

    // Mobile Details
    body('mobile1').matches(/^[6-9]\d{9}$/).withMessage('Invalid 10-digit mobile number'),
    
    // Addresses
    body('permanentAddress.houseNo').notEmpty().withMessage('Permanent House No. is required'),
    body('permanentAddress.state').notEmpty().withMessage('Permanent State is required'),
    body('permanentAddress.city').notEmpty().withMessage('Permanent City is required'),
    body('permanentAddress.pincode').matches(/^\d{6}$/).withMessage('Invalid 6-digit Pincode'),

    // Nominee
    body('nominee.name').notEmpty().withMessage('Nominee name is required'),
    body('nominee.relation').notEmpty().withMessage('Nominee relation is required'),
    body('nominee.age').isInt({ min: 1 }).withMessage('Valid nominee age is required'),
    body('nominee.houseNo').notEmpty().withMessage('Nominee House No is required'),
    body('nominee.city').notEmpty().withMessage('Nominee City is required'),
];

exports.validateMemberUpdate = [
    body('memberType').optional().isIn(['MEMBER', 'ASSOCIATE']),
    body('name').optional().trim(),
    body('mobile1').optional().matches(/^[6-9]\d{9}$/),
    body('membershipFee').optional().isNumeric(),
];
