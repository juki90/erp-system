import { StatusCodes } from 'http-status-codes';
import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchBaseQueryError,
    type FetchArgs
} from '@reduxjs/toolkit/query/react';

import { apiUrl } from 'config';
import { routes } from 'routes';
import isSsr from 'helpers/isSsr';

import type { RootState } from 'store';

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;

        const {
            auth: { authCookie }
        } = state;

        if (authCookie) {
            headers.set('cookie', authCookie);
        }

        return headers;
    }
});

const defaultFetchBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (...args) => {
    const result = await baseQuery(...args);

    if (
        result?.error?.status === StatusCodes.UNAUTHORIZED &&
        (args[0] as FetchArgs)?.url !== routes.login &&
        !isSsr
    ) {
        localStorage.clear();
        window.location.href = routes.login;
    }

    return result;
};

export default defaultFetchBaseQuery;
