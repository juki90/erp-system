const db = require('../db');
const { sequelize } = db;
const { DataTypes } = db.Sequelize;

const UserRole = sequelize.define(
    'UserRole',
    {
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Role',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'UserRoles'
    }
);

module.exports = UserRole;
