const { Leave } = require('../models');
const AbstractRepository = require('./Abstract');

class LeaveRepository extends AbstractRepository {
    get model() {
        return Leave;
    }
}

module.exports = LeaveRepository;
