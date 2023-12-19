const { UNAUTHORIZED } = require('http-status-codes');

module.exports = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.sendStatus(UNAUTHORIZED);
    }

    const di = req.app.get('di');
    const userRepository = di.get('repositories.user');

    const user = await userRepository.findById(req.session.userId);

    if (!user) {
        return res.sendStatus(UNAUTHORIZED);
    }

    req.loggedUser = user;

    return next();
};
