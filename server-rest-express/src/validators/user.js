const { body } = require('express-validator');

module.exports = [
    body('firstName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('First name can not be empty')
        .bail()
        .isLength({ min: 3, max: 32 })
        .withMessage('First name should contain 3-32 letters'),

    body('lastName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Last name can not be empty')
        .bail()
        .isLength({ min: 3, max: 32 })
        .withMessage('Last name should contain 3-32 letters'),

    body('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email can not be empty')
        .bail()
        .isEmail()
        .withMessage('Email address is not in correct format')
        .bail()
        .custom(async (email, { req }) => {
            const di = req.app.get('di');
            const userRepository = di.get('repositories.user');

            const user = await userRepository.findByEmail(email, { raw: true });

            if (user && req.params.id !== user.id) {
                return Promise.reject('User with this email already exists');
            }
        }),

    body('password')
        .trim()
        .custom((pass, { req }) => req.method === 'PUT' || pass)
        .withMessage('Password can not be empty')
        .bail()
        .custom((pass, { req }) => (!pass && req.method === 'PUT') || (pass.length >= 8 && pass.length <= 32))
        .withMessage('Password must be 8-32 characters in length'),

    body('birthDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Date is not provided')
        .bail()
        .isISO8601()
        .withMessage('Birth date is in wrong format or is unreal')
];
