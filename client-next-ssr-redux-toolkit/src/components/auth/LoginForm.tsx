import Link from 'next/link';

import { routes } from 'routes';
import useLogin from 'hooks/auth/useLogin';
import FormInput from 'components/FormInput';

import type { FC } from 'react';
import type { FieldError } from 'react-hook-form';

const LoginForm: FC = () => {
    const {
        errors,
        emailFieldProps,
        passwordFieldProps,
        result: { isSuccess, isLoading },
        onSubmit
    } = useLogin();

    return (
        <div className="flex items-center justify-center w-full min-h-[calc(100vh-50px)] bg-gradient-to-b from-gray-50 from-[50%] to-gray-300 to-[50%]">
            <div className="max-w-[360px] bg-gray-600 mx-2 p-8 rounded">
                <div className="flex items-center text-gray-300 text-xl md:text-2xl xl:text-4xl mx-auto [text-shadow:_1px_1px_1px_rgb(0_0_0_/_75%)]">
                    <h1 className="mx-auto select-none">
                        <span className="font-bold">ERP</span> System
                    </h1>
                </div>
                <h2 className="text-gray-200 text-lg md:text-xl xl:text-2xl text-center mb-4">
                    Login page
                </h2>
                <p className="text-gray-200 mb-4">
                    Enter your email and password of your created account
                </p>
                <form>
                    <FormInput
                        htmlFor="email"
                        label="E-mail"
                        labelClassName="block text-gray-100 mb-2"
                        fieldProps={emailFieldProps}
                        errorField={errors?.email as FieldError | undefined}
                    />
                    <FormInput
                        type="password"
                        label="Password"
                        htmlFor="password"
                        labelClassName="block text-gray-100 mb-2"
                        fieldProps={passwordFieldProps}
                        errorField={errors?.password as FieldError | undefined}
                    />
                    <div className="mb-4">
                        <div className="flex items-center">
                            <button
                                className="bg-gray-100 text-gray-800 px-4 py-2 mb-2 rounded cursor-pointer disabled:bg-gray-400"
                                type="submit"
                                disabled={isLoading || isSuccess}
                                onClick={onSubmit}
                            >
                                Sign in
                            </button>
                            {isLoading ? (
                                <div className="inline-block mx-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                            ) : null}
                        </div>
                        <small className="block text-md h-2 text-red-500 mb-3">
                            {errors?.general?.message as string}
                        </small>
                        <small className="text-gray-200">
                            If you forgot your password, you can{' '}
                            <Link
                                className="text-blue-300 underline"
                                href={routes.forgotPassword}
                            >
                                reset it
                            </Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
