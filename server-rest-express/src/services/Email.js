class EmailService {
    constructor(emailConfig, nodemailer) {
        this.emailConfig = emailConfig;
        this.nodemailer = nodemailer.createTransport(this.emailConfig);
    }

    send(options) {
        this.nodemailer.sendMail(options);
    }
}

module.exports = EmailService;
