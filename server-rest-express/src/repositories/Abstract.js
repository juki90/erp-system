const { Op } = require('sequelize');

class AbstractRepository {
    findOne(where, options) {
        return this.model.findOne({
            where: {
                ...where
            },
            ...options
        });
    }

    findById(id, options = {}) {
        return this.model.findOne({
            where: {
                id
            },
            ...options
        });
    }

    fetchAll(options = {}) {
        return this.model.findAll({ ...options });
    }

    create(data) {
        return this.model.create({
            ...data
        });
    }

    findOneByDateAndUser(startDate, endDate, userId, where = {}) {
        return this.model.findOne({
            where: {
                [Op.or]: [
                    {
                        startDate: {
                            [Op.lte]: startDate
                        },
                        endDate: {
                            [Op.gte]: startDate
                        }
                    },
                    {
                        startDate: {
                            [Op.lte]: endDate
                        },
                        endDate: {
                            [Op.gte]: endDate
                        }
                    },
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    {
                        startDate: {
                            [Op.gte]: startDate
                        },
                        endDate: {
                            [Op.lte]: endDate
                        }
                    }
                ],
                userId,
                ...where
            }
        });
    }
}

module.exports = AbstractRepository;
