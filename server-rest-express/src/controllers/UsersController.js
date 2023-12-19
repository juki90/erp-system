const { CREATED, NOT_FOUND, NO_CONTENT, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { User, Role } = require('../models');

class UsersController {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async index(req, res) {
        try {
            const users = await this.userRepository.fetchAll();

            return res.json(users);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userRepository.findById(id, { include: [{ association: 'roles' }] });

            if (!user) {
                return res.sendStatus(NOT_FOUND);
            }

            return res.json(user);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const { adminRights } = req.body;

            const createdUser = await this.userRepository.create(req.body, { fields: User.UPDATABLE_FIELDS });
            const adminRole = await this.roleRepository.findByName(Role.ADMIN);
            const userRole = await this.roleRepository.findByName(Role.USER);

            await createdUser.setRoles(adminRights ? [adminRole] : [userRole]);

            if (createdUser.password) {
                const refetchedUser = await this.userRepository.findById(createdUser.id);

                return res.status(CREATED).json(refetchedUser);
            }

            return res.status(CREATED).json(createdUser);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { adminRights, password } = req.body;

            const user = await this.userRepository.findById(id);

            if (!user) {
                return res.sendStatus(NOT_FOUND);
            }

            const adminRole = await this.roleRepository.findByName(Role.ADMIN);
            const userRole = await this.roleRepository.findByName(Role.USER);
            await user.update(req.body, {
                fields: password ? User.UPDATABLE_FIELDS : User.UPDATABLE_FIELDS_NO_PASSWORD
            });
            await user.removeRoles(await user.getRoles());
            await user.setRoles(adminRights ? [adminRole] : [userRole]);

            const userToSend = await this.userRepository.findById(id);

            return res.json(userToSend);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userRepository.findById(id);

            if (user) {
                await user.destroy();
            }

            return res.sendStatus(NO_CONTENT);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UsersController;
