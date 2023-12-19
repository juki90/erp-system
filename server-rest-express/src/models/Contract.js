const db = require('../db');
const { sequelize } = db;
const { DataTypes } = db.Sequelize;

const Contract = sequelize.define(
    'Contract',
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
        duration: {
            type: DataTypes.INTEGER,
            set(value) {
                this.setDataValue('duration', parseInt(value));
            },
            allowNull: false,
            defaultValue: 1
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        daysOff: {
            type: DataTypes.INTEGER,
            set(value) {
                this.setDataValue('daysOff', parseInt(value));
            },
            allowNull: false,
            defaultValue: 20
        }
    },
    {
        timestamps: true,
        tableName: 'Contracts'
    }
);

Contract.associate = function (models) {
    Contract.belongsTo(models.User, {
        as: 'user'
    });
};

Contract.UPDATABLE_FIELDS = ['startDate', 'endDate', 'daysOff', 'duration'];

module.exports = Contract;
