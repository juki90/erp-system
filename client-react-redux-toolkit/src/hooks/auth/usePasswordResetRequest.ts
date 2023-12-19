import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import {
    type FieldValues,
    type UseFormSetError,
    useForm
} from 'react-hook-form';
import errorConverter from 'helpers/errorConverter';
import type { ResetPasswordRequestRequest } from 'types';
import { useRequestPasswordResetMutation } from 'api/auth';
import { resetPasswordRequest } from 'validations/auth/passwordReset';

const usePasswordResetRequest = () => {
    const {
        formState: { errors },
        register,
        setError,
        handleSubmit
    } = useForm<ResetPasswordRequestRequest>({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const [requestPasswordReset, result] = useRequestPasswordResetMutation();

    const emailFieldProps = register('email', resetPasswordRequest.email);

    const onSubmit = handleSubmit(async credentials => {
        try {
            await requestPasswordReset(
                credentials as ResetPasswordRequestRequest
            );
        } catch (error) {
            console.error(error);

            toast.error('Error during executing request');
        }
    });

    useEffect(() => {
        if (result.isError) {
            errorConverter({
                error: result.error as FetchBaseQueryError,
                setError: setError as UseFormSetError<FieldValues>
            });
        }
    }, [result.isError]);

    return {
        result,
        errors,
        emailFieldProps,
        onSubmit
    };
};

export default usePasswordResetRequest;
