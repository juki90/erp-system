const { body } = require('express-validator');

const email = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('This is not correct email format')
        .bail()
        .custom(async (email, { req }) => {
            const di = req.app.get('di');
            const userRepository = di.get('repositories.user');

            const user = await userRepository.findByEmail(email);

            if (!user) {
                return Promise.reject('Employee with this email does not exist');
            }
        })
];
const password = [
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 8, max: 32 })
        .withMessage('Password must contain 8-32 characters'),

    body('passwordRepeat')
        .trim()
        .notEmpty()
        .withMessage('Password repeat is required')
        .bail()
        .isLength({ min: 8, max: 32 })
        .withMessage('Password repeat must contain 8-32 characters')
        .bail()
        .custom((passwordRepeat, { req }) => {
            if (req.body.password !== passwordRepeat) {
                throw new Error('Password repeat does not match given password');
            }

            return true;
        })
];

module.exports = {
    email,
    password
};
