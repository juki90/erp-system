const { User } = require('../models');
const AbstractRepository = require('./Abstract');

class UserRepository extends AbstractRepository {
    get model() {
        return User;
    }

    findByEmail(email, options = {}) {
        return this.model.findOne({
            where: {
                email
            },
            ...options
        });
    }
}

module.exports = UserRepository;
