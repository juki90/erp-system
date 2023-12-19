module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable(
            'Contracts',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                userId: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    onDelete: 'cascade',
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                startDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                duration: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 1
                },
                endDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                daysOff: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 20
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
                timestamps: true,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        ),

    down: queryInterface => queryInterface.dropTable('Contracts')
};
