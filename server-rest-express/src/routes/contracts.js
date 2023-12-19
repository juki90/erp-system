const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const isLogged = require('../middleware/isLogged');
const contractValidator = require('../validators/contract');
const checkErrors = require('../middleware/checkErrors');

module.exports = di => {
    const contractsController = di.get('controllers.contracts');

    router.get('/contracts', isLogged, (...args) => contractsController.index(...args));
    router.post('/contracts', isLogged, isAdmin, contractValidator, checkErrors, (...args) =>
        contractsController.store(...args)
    );
    router.put('/contracts/:id', isLogged, isAdmin, contractValidator, checkErrors, (...args) =>
        contractsController.update(...args)
    );
    router.delete('/contracts/:id', isLogged, isAdmin, (...args) => contractsController.delete(...args));

    return router;
};
