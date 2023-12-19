import React from 'react';
import usePasswordReset from 'hooks/auth/usePasswordReset';

const PasswordResetForm: React.FC = () => {
    const {
        errors,
        result,
        isError,
        isSuccess,
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
                {isSuccess ? (
                    <>
                        <p className="text-gray-200 mb-4">
                            On this page you can change your password
                        </p>
                        <form>
                            <div className="relative mb-8 pb-3">
                                <label
                                    htmlFor="password"
                                    className="block text-md text-gray-100 mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full p-1 rounded"
                                    {...passwordFieldProps}
                                />
                                {errors?.password ? (
                                    <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                        {errors?.password?.message as string}
                                    </small>
                                ) : null}
                            </div>
                            <div className="relative mb-8 pb-3">
                                <label
                                    htmlFor="passwordRepeat"
                                    className="block text-md text-gray-100 mb-2"
                                >
                                    Repeat password
                                </label>
                                <input
                                    id="passwordRepeat"
                                    type="password"
                                    className="w-full p-1 rounded"
                                    {...passwordRepeatFieldProps}
                                />
                                {errors?.passwordRepeat ? (
                                    <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                        {
                                            errors?.passwordRepeat
                                                ?.message as string
                                        }
                                    </small>
                                ) : null}
                            </div>
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
                        {isError ? (
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
