const bcrypt = require('bcryptjs');
const db = require('../db');
const { sequelize } = db;
const { DataTypes } = db.Sequelize;
const Role = require('./Role');

const User = sequelize.define(
    'User',
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            get() {
                return `${this.firstName} ${this.lastName}`;
            }
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Date is not valid'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'The given email address is not valid'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is required'
                }
            }
        },
        numberOfLeaveDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    },
    {
        timestamps: true,
        tableName: 'Users',
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        hooks: {
            beforeSave: (user, options) => {
                if (options.fields && options.fields.includes('password')) {
                    user.password = bcrypt.hashSync(user.password, 12);
                }
            }
        }
    }
);

User.prototype.isAdmin = async function () {
    const roles = await this.getRoles();

    return roles.some(role => role.name === Role.ADMIN);
};

User.associate = function (models) {
    User.belongsToMany(models.Role, {
        through: 'UserRole',
        as: 'roles',
        foreignKey: 'userId',
        otherKey: 'roleId',
        onDelete: 'cascade'
    });

    User.hasOne(models.PasswordReset, {
        as: 'passwordReset',
        foreignKey: 'userId'
    })

    User.hasMany(models.Contract, {
        as: 'contracts',
        foreignKey: 'userId'
    });

    User.hasMany(models.Leave, {
        as: 'leaves',
        foreignKey: 'userId'
    });
};

User.UPDATABLE_FIELDS = ['firstName', 'lastName', 'birthDate', 'email', 'password'];
User.UPDATABLE_FIELDS_NO_PASSWORD = ['firstName', 'lastName', 'birthDate', 'email'];

module.exports = User;
