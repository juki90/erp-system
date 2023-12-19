'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { routes } from 'routes';
import { useLoginMutation } from 'api/auth';
import { setLoggedUser } from 'reducers/authSlice';
import errorConverter from 'helpers/errorConverter';
import loginValidation from 'validations/auth/login';

import type { LoginRequest, LoggedUser } from 'types';

const useLogin = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        formState: { errors },
        watch,
        register,
        setError,
        clearErrors,
        handleSubmit
    } = useForm({ mode: 'onSubmit', reValidateMode: 'onChange' });
    const [login, result] = useLoginMutation();

    const formWatcher = watch();
    const emailFieldProps = register('email', loginValidation.email);
    const passwordFieldProps = register('password', loginValidation.password);
    const onSubmit = handleSubmit(async credentials => {
        try {
            await login(credentials as LoginRequest);
        } catch (error) {
            console.error(error);

            toast.error('Error during executing request');
        }
    });

    useEffect(() => {
        if (errors.general) {
            clearErrors('general');
            result.reset();
        }
    }, [formWatcher.email, formWatcher.password]);
    useEffect(() => {
        if (result.isError) {
            errorConverter({
                error: result.error as FetchBaseQueryError,
                setError
            });
        }
    }, [result.isError]);
    useEffect(() => {
        if (result.isSuccess) {
            const { data } = result as { data: LoggedUser };

            dispatch(setLoggedUser(data));
            router.push(routes.root);
            toast.success('Successfully logged in');
        }
    }, [result.isSuccess]);

    return {
        result,
        errors,
        emailFieldProps,
        passwordFieldProps,
        onSubmit
    };
};

export default useLogin;
