import { UUIDV4_REGEX } from 'config/constants';
import checkValidDate from 'helpers/checkValidDate';

const createOrUpdate = {
    userId: {
        required: 'User id should not be empty',
        pattern: {
            value: UUIDV4_REGEX,
            message: 'Incorrect UUIDv4'
        }
    },
    startDate: {
        required: 'Start date is not provided',
        validate: {
            checkValidDate: (date: string): boolean | string =>
                checkValidDate(date) ||
                'Start date is in wrong format or is unreal'
        }
    },
    duration: {
        valueAsNumber: true,
        required: 'Duration is not provided',
        validate: {
            checkDurations: (duration: number): boolean | string =>
                [1, 3, 6, 12].includes(duration) ||
                'Wrong duration of the contract'
        }
    },
    daysOff: {
        required: 'Days off are not provided',
        validate: {
            checkDaysOff: (daysOff: string | number): boolean | string =>
                (['20', '26'] as (number | string)[]).includes(daysOff) ||
                'Wrong days off of the contract'
        }
    }
};

export default createOrUpdate;
