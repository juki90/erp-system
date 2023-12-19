const AbstractConsumer = require('../AbstractConsumer');

class EmailsConsumer extends AbstractConsumer {
    constructor(channel, name, sendResetPasswordLinkToUserHandler) {
        super(channel, name);
        this.sendResetPasswordLinkToUserHandler = sendResetPasswordLinkToUserHandler;

        console.log('\x1b[32m', 'EmailsConsumer instance created');
    }

    async _processing(item) {
        await this.sendResetPasswordLinkToUserHandler.handle(item);
    }
}

module.exports = EmailsConsumer;
