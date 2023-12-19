const { Op } = require('sequelize');
const { Contract } = require('../models');
const AbstractRepository = require('./Abstract');

class ContractRepository extends AbstractRepository {
    get model() {
        return Contract;
    }

    findOneWithinDate(startDate, endDate, userId) {
        return this.model.findOne({
            where: {
                startDate: {
                    [Op.lte]: startDate
                },
                endDate: {
                    [Op.gte]: endDate
                },
                userId
            }
        });
    }
}

module.exports = ContractRepository;
