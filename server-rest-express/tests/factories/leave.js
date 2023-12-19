const faker = require('faker');
const moment = require('moment');
const { Leave } = require('../../src/models');

class LeaveFactory {
    static generate(props) {
        const date = (props && props.startDate) || faker.date.future();
        const defaultProps = {
            userId: faker.random.uuid(),
            startDate: date,
            endDate: date,
            isConfirmed: true
        };

        return {
            ...defaultProps,
            ...props
        };
    }

    static create(props) {
        return Leave.create(this.generate(props));
    }
}

module.exports = LeaveFactory;
