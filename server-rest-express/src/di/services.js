const config = require('../config');

module.exports = {
    parameters: {
        config: config,
        'config.email': config.email
    },
    services: {
        'services.calculateContractLeaveDaysOnUserService': {
            class: '../services/Users/CalculateContractLeaveDaysOnUserService',
            arguments: ['@repositories.user']
        },
        'services.calculateLeaveDaysOnUserService': {
            class: '../services/Users/CalculateLeaveDaysOnUserService',
            arguments: ['%moment', '@repositories.user']
        },
        'services.checkIfUserHasEnoughLeaveDays': {
            class: '../services/Leaves/CheckIfUserHasEnoughLeaveDays',
            arguments: ['%moment', '@repositories.user']
        },
        'services.user.sendResetPasswordLinkToUserHandler': {
            class: '../services/Users/SendResetPasswordLinkToUserHandler',
            arguments: ['%config.email%', '@services.email']
        },
        'services.user.sendResetPasswordLinkToUserManager': {
            class: '../services/Users/SendResetPasswordLinkToUserManager',
            arguments: [
                '@queues.publishers.emails',
                '@services.user.sendResetPasswordLinkToUserHandler',
                '%config%',
                '%crypto'
            ]
        },
        'services.email': {
            class: '../services/Email',
            arguments: ['%config.email%', '%nodemailer']
        }
    }
};
