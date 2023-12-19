module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'UserRoles',
            {
                userId: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                roleId: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                createdAt: {
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
        );
    },
    down: queryInterface => {
        return queryInterface.dropTable('UserRoles');
    }
};
