const loginValidation = {
    email: {
        required: 'Email is required',
        maxLength: {
            value: 254,
            message: 'This is not correct email format'
        },
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'This is not correct email format'
        }
    },
    password: {
        required: 'Password is required',
        minLength: {
            value: 8,
            message: 'Password must contain 8-32 characters'
        },
        maxLength: {
            value: 32,
            message: 'Password must contain 8-32 characters'
        }
    }
};

export default loginValidation;
