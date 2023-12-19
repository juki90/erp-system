const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const isLogged = require('../middleware/isLogged');
const userValidator = require('../validators/user');
const checkErrors = require('../middleware/checkErrors');

module.exports = di => {
    const usersController = di.get('controllers.users');
    const userContractsController = di.get('controllers.userContracts');
    const userLeavesController = di.get('controllers.userLeaves');

    router.get('/users', isLogged, isAdmin, (...args) => usersController.index(...args));
    router.get('/users/:id/contracts', isLogged, isAdmin, (...args) => userContractsController.index(...args));
    router.get('/users/:id/leaves', isLogged, isAdmin, (...args) => userLeavesController.index(...args));
    router.get('/users/:id', isLogged, isAdmin, (...args) => usersController.show(...args));
    router.post('/users', isLogged, isAdmin, userValidator, checkErrors, (...args) => usersController.store(...args));
    router.put('/users/:id', isLogged, isAdmin, userValidator, checkErrors, (...args) =>
        usersController.update(...args)
    );
    router.delete('/users/:id', isLogged, isAdmin, (...args) => usersController.delete(...args));

    return router;
};
