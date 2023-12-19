const { PasswordReset } = require('../models');
const AbstractRepository = require('./Abstract');

class PasswordResetRepository extends AbstractRepository {
    get model() {
        return PasswordReset;
    }

    findByToken(token, options = {}) {
        return this.model.findOne({
            where: {
                token
            },
            ...options
        });
    }
}

module.exports = PasswordResetRepository;
