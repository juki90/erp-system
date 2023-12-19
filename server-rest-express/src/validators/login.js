const { body } = require('express-validator');

module.exports = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('This is not correct email format'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 8, max: 32 })
        .withMessage('Password must contain 8-32 characters')
];
