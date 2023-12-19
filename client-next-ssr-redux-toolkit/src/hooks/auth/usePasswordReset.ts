import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { FieldValues, UseFormSetError, useForm } from 'react-hook-form';

import { routes } from 'routes';
import SsrContext from 'context/ssr';
import errorConverter from 'helpers/errorConverter';
import { useResetPasswordMutation } from 'api/auth';
import { resetPassword } from 'validations/auth/passwordReset';

import type { ResetPasswordRequest } from 'types';

const usePasswordResetRequest = () => {
    const router = useRouter();
    const {
        fetchErrors: { isTokenFetchFailed }
    } = useContext(SsrContext);
    const {
        formState: { errors },
        register,
        setError,
        handleSubmit
    } = useForm<ResetPasswordRequest>({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const passwordFieldProps = register('password', resetPassword.password);
    const passwordRepeatFieldProps = register(
        'passwordRepeat',
        resetPassword.passwordRepeat
    );

    const [requestPasswordReset, result] = useResetPasswordMutation();
    const {
        query: { token = '' }
    } = router;

    const toastAndRedirect = (type: 'error' | 'success' = 'error') => {
        toast[type](
            type === 'error'
                ? 'Password reset token has expired'
                : 'Successfully changed password'
        );

        setTimeout(() => {
            router.push(routes.login);
        }, 5000);
    };

    const onSubmit = handleSubmit(async (credentials: ResetPasswordRequest) => {
        try {
            await requestPasswordReset({ ...credentials, token } as {
                token: string;
            } & ResetPasswordRequest);
        } catch (error) {
            console.error(error);

            toast.error('Error during executing request');
        }
    });

    if (isTokenFetchFailed) {
        toastAndRedirect();
    }

    useEffect(() => {
        if (result.isError && Array.isArray(result.error)) {
            errorConverter({
                error: result.error as FetchBaseQueryError,
                setError: setError as UseFormSetError<FieldValues>
            });

            return;
        }

        if (result.isError) {
            toastAndRedirect();
        }
    }, [result.isError]);
    useEffect(() => {
        if (result.isSuccess) {
            toastAndRedirect('success');
        }
    }, [result.isSuccess]);

    return {
        result,
        errors,
        passwordFieldProps,
        isTokenFetchFailed,
        passwordRepeatFieldProps,
        onSubmit
    };
};

export default usePasswordResetRequest;
