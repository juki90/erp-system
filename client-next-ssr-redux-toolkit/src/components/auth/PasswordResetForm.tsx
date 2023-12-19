import { FC } from 'react';

import FormInput from 'components/FormInput';
import usePasswordReset from 'hooks/auth/usePasswordReset';

const PasswordResetForm: FC = () => {
    const {
        errors,
        result,
        isTokenFetchFailed,
        passwordFieldProps,
        passwordRepeatFieldProps,
        onSubmit
    } = usePasswordReset();

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
                {!isTokenFetchFailed ? (
                    <>
                        <p className="text-gray-200 mb-4">
                            On this page you can change your password
                        </p>
                        <form>
                            <FormInput
                                type="password"
                                label="Password"
                                htmlFor="password"
                                labelClassName="block text-gray-100 mb-2"
                                errorField={errors?.password}
                                fieldProps={passwordFieldProps}
                            />
                            <FormInput
                                type="password"
                                label="Repeat password"
                                htmlFor="passwordRepeat"
                                labelClassName="block text-gray-100 mb-2"
                                errorField={errors?.passwordRepeat}
                                fieldProps={passwordRepeatFieldProps}
                            />
                            <div className="mb-4">
                                <div className="flex items-center mb-3">
                                    <button
                                        className="bg-gray-100 text-gray-800 px-4 py-2 mb-2 rounded cursor-pointer disabled:bg-gray-400"
                                        type="submit"
                                        disabled={
                                            result.isLoading || result.isSuccess
                                        }
                                        onClick={onSubmit}
                                    >
                                        Change
                                    </button>
                                    {result.isLoading ? (
                                        <div className="inline-block mx-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                                    ) : null}
                                </div>
                                {result.isSuccess ? (
                                    <p className="text-green-400 text-center">
                                        Successfully changed password, now you
                                        can log in
                                    </p>
                                ) : null}
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="w-full flex justify-center p-8">
                            <div className="inline-block mx-4 h-20 w-20 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                        </div>
                        {isTokenFetchFailed ? (
                            <p className="text-red-500 text-center">
                                You are not allowed to access this page...
                            </p>
                        ) : (
                            <p className="text-gray-200 text-center">
                                Checking...
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PasswordResetForm;
