const { validationResult } = require('express-validator');
const { BAD_REQUEST } = require('http-status-codes');

module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(BAD_REQUEST).json(
            errors.array().map(e => ({
                message: e.msg,
                param: e.param
            }))
        );
    } else {
        return next();
    }
};
