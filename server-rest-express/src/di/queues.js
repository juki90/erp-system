const config = require('../config');

module.exports = {
    parameters: {
        'config.rabbitmq': config.rabbitmq,
        'config.rabbitmq.queues.emails': config.rabbitmq.queues.emails
    },
    services: {
        'queues.connection': {
            arguments: ['%amqplib', '%config.rabbitmq%'],
            factory: {
                class: '../services/Queues/ConnectionFactory',
                method: 'create'
            }
        },
        'queues.channels.emails': {
            arguments: ['@queues.connection', '%config.rabbitmq.queues.emails%'],
            factory: {
                class: '../services/Queues/ChannelFactory',
                method: 'create'
            }
        },
        'queues.publishers.emails': {
            class: '../services/Queues/Publisher',
            arguments: ['@queues.channels.emails', '%config.rabbitmq.queues.emails%']
        },
        'queues.consumers.emails': {
            class: '../services/Queues/Consumers/EmailsConsumer',
            arguments: [
                '@queues.channels.emails',
                '%config.rabbitmq.queues.emails%',
                '@services.user.sendResetPasswordLinkToUserHandler'
            ]
        }
    }
};
