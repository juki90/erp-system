module.exports = {
    services: {
        'repositories.user': {
            class: '../repositories/User'
        },
        'repositories.role': {
            class: '../repositories/Role'
        },
        'repositories.contract': {
            class: '../repositories/Contract'
        },
        'repositories.leave': {
            class: '../repositories/Leave'
        },
        'repositories.passwordReset': {
            class: '../repositories/PasswordReset'
        }
    }
};
