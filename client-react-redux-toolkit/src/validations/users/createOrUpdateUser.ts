import checkValidDate from 'helpers/checkValidDate';

const update = {
    firstName: {
        required: 'First name can not be empty',
        minLength: {
            value: 3,
            message: 'First name should contain 3-32 letters'
        },
        maxLength: {
            value: 32,
            message: 'First name should contain 3-32 letters'
        }
    },
    lastName: {
        required: 'Last name can not be empty',
        minLength: {
            value: 3,
            message: 'Last name should contain 3-32 letters'
        },
        maxLength: {
            value: 32,
            message: 'Last name should contain 3-32 letters'
        }
    },
    email: {
        required: 'Email can not be empty',
        maxLength: {
            value: 254,
            message: 'Email address is not in correct format'
        },
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email address is not in correct format'
        }
    },
    birthDate: {
        required: 'Date is not provided',
        minLength: {
            value: 3,
            message: 'Last name should contain 3-32 letters'
        },
        maxLength: {
            value: 32,
            message: 'Last name should contain 3-32 letters'
        },
        validate: {
            checkValidDate: (date: string): boolean | string =>
                checkValidDate(date) ||
                'Birth date is in wrong format or is unreal'
        }
    }
};

const create = {
    ...update,

    password: {
        required: 'Password can not be empty',
        minLength: {
            value: 8,
            message: 'Password must be 8-32 characters in length'
        },
        maxLength: {
            value: 32,
            message: 'Password must be 8-32 characters in length'
        }
    }
};

export default { create, update };
