const db = require('../db');
const { sequelize } = db;
const { DataTypes } = db.Sequelize;

const Role = sequelize.define(
    'Role',
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        }
    },
    {
        tableName: 'Roles',
        underscored: false,
        timestamps: true
    }
);

Role.associate = function (models) {
    Role.belongsToMany(models.User, {
        through: 'UserRole',
        as: 'users',
        foreignKey: 'roleId',
        otherKey: 'userId'
    });
};

Role.ADMIN = 'admin';
Role.USER = 'user';

module.exports = Role;
