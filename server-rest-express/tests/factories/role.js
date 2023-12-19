const faker = require('faker');
const { Role } = require('../../src/models');

class RoleFactory {
    static generate(props) {
        const defaultProps = {
            name: faker.internet.domainWord()
        };

        return {
            ...defaultProps,
            ...props
        };
    }

    static build(props) {
        return Role.build(this.generate(props));
    }

    static create(props) {
        return User.create(this.generate(props));
    }
}

module.exports = RoleFactory;
