import Link from 'next/link';

import { routes } from 'routes';
import FormInput from 'components/FormInput';
import usePasswordResetRequest from 'hooks/auth/usePasswordResetRequest';

import type { FC } from 'react';

const PasswordResetRequestForm: FC = () => {
    const {
        errors,
        emailFieldProps,
        result: { isSuccess, isLoading },
        onSubmit
    } = usePasswordResetRequest();

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-50 from-[50%] to-gray-300 to-[50%]">
            <div className="max-w-[360px] bg-gray-600 mx-2 p-8 rounded translate-y-[-10%]">
                <div className="flex items-center text-gray-300 text-xl md:text-2xl xl:text-4xl mx-auto [text-shadow:_1px_1px_1px_rgb(0_0_0_/_75%)]">
                    <h1 className="mx-auto select-none">
                        <span className="font-bold">ERP</span> System
                    </h1>
                </div>
                <h2 className="text-gray-200 text-lg md:text-xl xl:text-2xl text-center mb-4">
                    Reset password
                </h2>
                <p className="text-gray-200 mb-4">
                    You are about to reset your password. Enter your registered
                    email and click Reset button. You will receive email with
                    further steps
                </p>
                <form>
                    {isSuccess ? (
                        <p className="text-green-400 mb-4">
                            Your password reset request has been received!
                            <br /> Please check your email in a moment
                        </p>
                    ) : (
                        <FormInput
                            label="E-Mail"
                            htmlFor="email"
                            labelClassName="block text-gray-100 mb-2"
                            errorField={errors?.email}
                            fieldProps={emailFieldProps}
                        />
                    )}
                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                            <button
                                className="bg-gray-100 text-gray-800 px-4 py-2 mb-2 rounded cursor-pointer disabled:bg-gray-400"
                                type="submit"
                                disabled={isLoading || isSuccess}
                                onClick={onSubmit}
                            >
                                Reset
                            </button>
                            {isLoading ? (
                                <div className="inline-block mx-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                            ) : null}
                        </div>
                        <small className="text-gray-200">
                            Go back to{' '}
                            <Link
                                className="text-blue-300 underline"
                                href={routes.login}
                            >
                                login
                            </Link>{' '}
                            page
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordResetRequestForm;
