const moment = require('moment');
const db = require('../db');
const { sequelize } = db;
const { DataTypes } = db.Sequelize;

const PasswordReset = sequelize.define(
    'PasswordReset',
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
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'PasswordResets',
        hooks: {
            beforeValidate: passwordReset => {
                passwordReset.expiresAt = moment().add(2, 'days');
            }
        }
    }
);

PasswordReset.associate = function (models) {
    PasswordReset.belongsTo(models.User, {
        as: 'user'
    });
};

PasswordReset.prototype.isExpired = function () {
    return moment(this.expiresAt).isBefore(moment());
};

module.exports = PasswordReset;
