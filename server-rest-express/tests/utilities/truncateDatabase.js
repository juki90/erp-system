const { sequelize } = require('../../src/models');

module.exports = async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await Promise.all(
        Object.keys(sequelize.models)
            .filter(key => key.toLowerCase() !== 'sequelize')
            .map(key => sequelize.models[key].destroy({ where: {}, force: true }))
    );

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};
