const { UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, NO_CONTENT } = require('http-status-codes');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class AuthController {
    constructor(userRepository, passwordResetRepository, sendResetPasswordLinkToUserManager) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.sendResetPasswordLinkToUserManager = sendResetPasswordLinkToUserManager;
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const userToCheck = await this.userRepository.findByEmail(email, {
                attributes: ['id', 'email', 'password']
            });

            if (!userToCheck) {
                return res.status(UNAUTHORIZED).json([{ message: 'Wrong email or password', param: 'general' }]);
            }

            const isValid = bcrypt.compareSync(password, userToCheck.password);

            if (!isValid) {
                return res.status(UNAUTHORIZED).json([{ message: 'Wrong email or password', param: 'general' }]);
            }

            req.session.userId = userToCheck.id;

            const userToSend = await this.userRepository.findById(userToCheck.id, {
                include: [{ association: 'roles' }]
            });

            return res.json(userToSend);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async logout(req, res) {
        if (req.session) {
            delete req.session.userId;
            req.session.destroy();
        }

        return res.sendStatus(OK);
    }

    async me(req, res) {
        try {
            const user = await this.userRepository.findById(req.loggedUser.id, { include: [{ association: 'roles' }] });

            return res.json(user);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                return res.sendStatus(NO_CONTENT);
            }

            const token = crypto.randomBytes(32).toString('hex');

            await user.createPasswordReset({ token });
            await this.sendResetPasswordLinkToUserManager.manage(user, token);

            return res.sendStatus(NO_CONTENT);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async checkPasswordReset(req, res) {
        try {
            const { token } = req.params;

            const passwordReset = await this.passwordResetRepository.findByToken(token);

            if (!passwordReset || passwordReset.isExpired()) {
                return res.sendStatus(BAD_REQUEST);
            }

            return res.sendStatus(OK);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async resetPassword(req, res) {
        try {
            const {
                params: { token },
                body: { password }
            } = req;

            const passwordReset = await this.passwordResetRepository.findByToken(token);

            if (!passwordReset || passwordReset.isExpired()) {
                return res.sendStatus(BAD_REQUEST);
            }

            const user = await passwordReset.getUser();

            if (!user) {
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .json([{ message: 'User connected to this password reset does not exist', param: 'general' }]);
            }

            await user.update({ password });
            await passwordReset.destroy();

            return res.sendStatus(OK);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = AuthController;
