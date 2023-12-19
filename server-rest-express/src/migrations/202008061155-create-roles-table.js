module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Roles',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: Sequelize.STRING
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('NOW')
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('NOW')
                }
            },
            {
                timestamps: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    },
    down: queryInterface => {
        return queryInterface.dropTable('Roles');
    }
};
