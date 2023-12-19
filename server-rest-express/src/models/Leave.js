const db = require('../db');
const { sequelize } = db;
const { DataTypes } = db.Sequelize;

const Leave = sequelize.define(
    'Leave',
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            onDelete: 'cascade',
            references: {
                model: 'User',
                key: 'id'
            }
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        timestamps: true,
        tableName: 'Leaves'
    }
);

Leave.associate = function (models) {
    Leave.belongsTo(models.User, {
        as: 'user'
    });
};

Leave.UPDATABLE_FIELDS = ['startDate', 'endDate', 'isConfirmed'];

module.exports = Leave;
