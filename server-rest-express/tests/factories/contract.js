const faker = require('faker');
const moment = require('moment');
const { Contract } = require('../../src/models');

class ContractFactory {
    static generate(props) {
        const date = (props && props.startDate) || faker.date.future();
        const defaultProps = {
            userId: faker.random.uuid(),
            startDate: date,
            endDate: moment(date).add(1, 'M').subtract(1, 'd').format('YYYY-MM-DD'),
            duration: 1,
            daysOff: 20
        };

        return {
            ...defaultProps,
            ...props
        };
    }

    static create(props) {
        return Contract.create(this.generate(props));
    }
}

module.exports = ContractFactory;
