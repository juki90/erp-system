module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable(
            'Leaves',
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
                endDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                isConfirmed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
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

    down: queryInterface => queryInterface.dropTable('Leaves')
};
