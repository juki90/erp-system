class SendResetPasswordLinkToUserManager {
    constructor(emailPublisher, sendResetPasswordLinkToUserHandler, config, crypto) {
        this.emailPublisher = emailPublisher;
        this.sendResetPasswordLinkToUserHandler = sendResetPasswordLinkToUserHandler;
        this.config = config;
        this.crypto = crypto;
    }

    async manage(user, token) {
        const params = user.toJSON();
        const resetPasswordLink = `${this.config.app.frontendUrl}/forgot-password/${token}`;
        const paramsWithLink = {
            ...params,
            link: resetPasswordLink
        };

        if (this.config.email.useQueue) {
            return await this.emailPublisher.publish(paramsWithLink);
        }

        return this.sendResetPasswordLinkToUserHandler.handle(paramsWithLink);
    }
}

module.exports = SendResetPasswordLinkToUserManager;
