const { Role } = require('../models');
const AbstractRepository = require('./Abstract');

class RoleRepository extends AbstractRepository {
    get model() {
        return Role;
    }

    findByName(name) {
        return this.model.findOne({
            where: {
                name
            }
        });
    }
}

module.exports = RoleRepository;
