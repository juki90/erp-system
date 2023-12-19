const faker = require('faker');
const { User } = require('../../src/models');

class UserFactory {
    static generate(props) {
        const defaultProps = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.name.firstName(null),
            lastName: faker.name.lastName(null),
            birthDate: faker.date.past()
        };

        return {
            ...defaultProps,
            ...props
        };
    }

    static build(props) {
        return User.build(this.generate(props));
    }

    static create(props) {
        return User.create(this.generate(props));
    }
}

module.exports = UserFactory;
