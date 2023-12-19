module.exports = {
    services: {
        'controllers.auth': {
            class: '../controllers/AuthController',
            arguments: [
                '@repositories.user',
                '@repositories.passwordReset',
                '@services.user.sendResetPasswordLinkToUserManager'
            ]
        },
        'controllers.users': {
            class: '../controllers/UsersController',
            arguments: ['@repositories.user', '@repositories.role']
        },
        'controllers.contracts': {
            class: '../controllers/ContractsController',
            arguments: [
                '@repositories.contract',
                '@repositories.user',
                '@services.calculateContractLeaveDaysOnUserService'
            ]
        },
        'controllers.leaves': {
            class: '../controllers/LeavesController',
            arguments: [
                '@repositories.user',
                '@repositories.leave',
                '@services.calculateLeaveDaysOnUserService',
                '@services.checkIfUserHasEnoughLeaveDays'
            ]
        },
        'controllers.userContracts': {
            class: '../controllers/UserContractsController',
            arguments: ['@repositories.user', '@repositories.contract']
        },
        'controllers.userLeaves': {
            class: '../controllers/UserLeavesController',
            arguments: ['@repositories.user', '@repositories.leave']
        }
    }
};
