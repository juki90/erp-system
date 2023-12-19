const resetPassword = {
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
    },
    passwordRepeat: {
        required: 'Password repeat is required',
        minLength: {
            value: 8,
            message: 'Password repeat must contain 8-32 characters'
        },
        maxLength: {
            value: 32,
            message: 'Password repeat must contain 8-32 characters'
        },
        validate: {
            checkIfPasswordAndPasswordResetAreTheSame: (
                passwordRepeat: string,
                { password }: { password: string }
            ): boolean | string =>
                password === passwordRepeat ||
                'Password repeat does not match given password'
        }
    }
};

const resetPasswordRequest = {
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
    }
};

export { resetPassword, resetPasswordRequest };
