const { FORBIDDEN } = require('http-status-codes');

module.exports = async (req, res, next) => {
    const isAdmin = await req.loggedUser.isAdmin();

    if (isAdmin) {
        return next();
    }

    return res.sendStatus(FORBIDDEN);
};
