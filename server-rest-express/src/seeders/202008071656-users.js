const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const faker = require('faker');
const { User, Role } = require('../models');
const di = require('../di');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [
            {
                id: uuid(),
                firstName: 'John',
                lastName: 'Admin',
                birthDate: faker.date.past(),
                email: 'john@erpemployee.test',
                password: bcrypt.hashSync('88888888', 12),
                numberOfLeaveDays: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid(),
                firstName: 'Jane',
                lastName: 'User',
                birthDate: faker.date.past(),
                email: 'jane@erpemployee.test',
                password: bcrypt.hashSync('88888888', 12),
                numberOfLeaveDays: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        const roleRepository = di.get('repositories.role');

        const admin = await User.findOne({ where: { lastName: 'Admin' } });
        const user = await User.findOne({ where: { lastName: 'User' } });
        const adminRole = await roleRepository.findByName(Role.ADMIN);
        const userRole = await roleRepository.findByName(Role.USER);

        await admin.setRoles([adminRole]);
        await user.setRoles([userRole]);
    },
    down: () => {}
};
