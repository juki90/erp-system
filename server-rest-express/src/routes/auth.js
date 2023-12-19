const express = require('express');
const router = express.Router();
const loginValidator = require('../validators/login');
const passwordResetValidator = require('../validators/passwordReset');
const checkErrors = require('../middleware/checkErrors');
const isLogged = require('../middleware/isLogged');

module.exports = di => {
    const authController = di.get('controllers.auth');

    router.post('/login', loginValidator, checkErrors, (...args) => authController.login(...args));
    router.get('/logout', (...args) => authController.logout(...args));
    router.get('/me', isLogged, (...args) => authController.me(...args));

    router.get('/reset-password/:token', (...args) => authController.checkPasswordReset(...args));
    router.post('/reset-password', passwordResetValidator.email, checkErrors, (...args) =>
        authController.requestPasswordReset(...args)
    );
    router.post('/reset-password/:token', passwordResetValidator.password, checkErrors, (...args) =>
        authController.resetPassword(...args)
    );

    return router;
};
