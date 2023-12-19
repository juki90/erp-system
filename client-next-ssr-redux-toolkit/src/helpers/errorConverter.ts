import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import isSsr from './isSsr';
import { routes } from 'routes';

import type { FieldValues, UseFormSetError } from 'react-hook-form';

export default ({
    error,
    setError,
    handleNotFound
}: {
    error: FetchBaseQueryError;
    setError?: UseFormSetError<FieldValues>;
    handleNotFound?: () => void;
}) => {
    console.error(error);

    if (isSsr) {
        return;
    }

    const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } =
        StatusCodes;

    if (
        error?.status === BAD_REQUEST ||
        (error?.status === UNAUTHORIZED &&
            window.location.href.startsWith(
                `${window.location.origin}${routes.login}`
            ))
    ) {
        (error?.data as { param: string; message: string }[]).forEach(
            ({ param, message }) => setError!(param, { message })
        );

        toast.error('Fix errors in the form');

        return;
    }

    if (error?.status === NOT_FOUND) {
        handleNotFound!();

        return;
    }

    if (!navigator?.onLine) {
        toast.error('You are probably offline');

        return;
    }

    if (
        error?.status === 'FETCH_ERROR' ||
        (typeof error?.status === 'number' &&
            error.status >= INTERNAL_SERVER_ERROR)
    ) {
        toast.error('Our server is down, please check later');
    }
};
