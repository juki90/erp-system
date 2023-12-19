import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { FieldValues, UseFormSetError, useForm } from 'react-hook-form';
import { routes } from 'router';
import type { ResetPasswordRequest } from 'types';
import errorConverter from 'helpers/errorConverter';
import { resetPassword } from 'validations/auth/passwordReset';
import {
    useResetPasswordMutation,
    useCheckPasswordResetRequestQuery
} from 'api/auth';

const usePasswordResetRequest = () => {
    const navigate = useNavigate();
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
    const { token = '' } = useParams();
    const { isError, isSuccess } = useCheckPasswordResetRequestQuery(token);

    const toastAndRedirect = (type: 'error' | 'success' = 'error') => {
        toast[type](
            type === 'error'
                ? 'Password reset token has expired'
                : 'Successfully changed password'
        );

        setTimeout(() => {
            navigate(routes.login);
        }, 3000);
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
    useEffect(() => {
        if (isError) {
            toastAndRedirect();
        }
    }, [isError]);

    return {
        result,
        errors,
        isError,
        isSuccess,
        passwordFieldProps,
        passwordRepeatFieldProps,
        onSubmit
    };
};

export default usePasswordResetRequest;
