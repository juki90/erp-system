import { UUIDV4_REGEX } from 'config/constants';
import checkValidDate from 'helpers/checkValidDate';
import checkEndDateBeforeStartDate from 'helpers/checkEndDateBeforeStartDate';

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
    endDate: {
        required: 'End date is not provided',
        validate: {
            checkValidDate: (date: string): boolean | string =>
                checkValidDate(date) ||
                'End date is in wrong format or is unreal',
            checkEndDateBeforeStartDate: (
                endDate: string,
                { startDate }: { startDate: string }
            ): boolean | string =>
                checkEndDateBeforeStartDate(startDate, endDate) ||
                'Start date must be before end date'
        }
    }
};

export default createOrUpdate;
