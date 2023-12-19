module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable(
            'PasswordResets',
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true
                },
                userId: {
                    type: Sequelize.UUID,
                    onDelete: 'cascade',
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                token: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                expiresAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('NOW'),
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('NOW'),
                    allowNull: false
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        ),

    down: queryInterface => queryInterface.dropTable('PasswordResets')
};
