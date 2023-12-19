const faker = require('faker');
const { User, Role } = require('../../src/models');

module.exports = async () => {
    const adminRole = await Role.create({ name: Role.ADMIN });
    const userRole = await Role.create({ name: Role.USER });

    const adminUser = await User.create({
        firstName: Role.ADMIN,
        lastName: Role.ADMIN,
        email: 'admin@erpemployee.test',
        password: 'password',
        birthDate: faker.date.past()
    });

    await adminUser.addRole(adminRole);

    const user = await User.create({
        firstName: Role.USER,
        lastName: Role.USER,
        email: 'user@erpemployee.test',
        password: 'password',
        birthDate: faker.date.past()
    });

    await user.addRole(userRole);

    const editable = await User.create({
        firstName: 'editable',
        lastName: 'editable',
        email: 'editable@erpemployee.test',
        password: 'password',
        birthDate: faker.date.past()
    });

    await editable.addRole(userRole);
};
