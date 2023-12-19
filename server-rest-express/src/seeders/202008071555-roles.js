const uuid = require('uuid/v4');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Roles',
            [
                {
                    id: uuid(),
                    name: 'admin',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuid(),
                    name: 'user',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    down: () => {}
};
