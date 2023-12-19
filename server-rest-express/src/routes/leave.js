const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const isLogged = require('../middleware/isLogged');
const leaveValidator = require('../validators/leave');
const checkErrors = require('../middleware/checkErrors');

module.exports = di => {
    const leavesController = di.get('controllers.leaves');

    router.get('/leaves', isLogged, (...args) => leavesController.index(...args));
    router.post('/leaves', isLogged, leaveValidator, checkErrors, (...args) => leavesController.store(...args));
    router.put('/leaves/:id', isLogged, leaveValidator, checkErrors, (...args) => leavesController.update(...args));
    router.put('/leaves/:id/confirm', isLogged, isAdmin, (...args) => leavesController.confirm(...args));
    router.delete('/leaves/:id', isLogged, (...args) => leavesController.delete(...args));

    return router;
};
