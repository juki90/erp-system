class SendResetPasswordLinkToUserHandler {
    constructor(emailConfig, emailService) {
        this.emailConfig = emailConfig;
        this.emailService = emailService;
    }

    async handle(params) {
        const { email, firstName, lastName, link } = params;
        const msg = {
            from: this.emailConfig.from.address,
            to: email,
            subject: 'Password Recovery',
            text: `Hello, ${firstName} ${lastName}
            You requested a reset of you password, to reset your password, please visit this link:
            ${link}
            If this request didn't come from you, then please ignore this message`,
            html: `<h1>Hello, ${firstName} ${lastName}</h1>, 
            <p>You requested a reset of you password, to reset your password, please visit this link:<p>
            <p><a href="${link}">${link}</a></p>
            <p>If this request didn't come from you, then please ignore this message</p>`
        };

        try {
            await this.emailService.send(msg);
        } catch (error) {
            console.error(error.response ? error.response.body : error);
        }
    }
}

module.exports = SendResetPasswordLinkToUserHandler;
