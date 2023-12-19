import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';
import { apiUrl } from 'config';
import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchBaseQueryError,
    type FetchArgs
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include'
});

const defaultFetchBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (...args) => {
    const result = await baseQuery(...args);

    if (
        result?.error?.status === StatusCodes.UNAUTHORIZED &&
        (args[0] as FetchArgs)?.url !== '/login'
    ) {
        localStorage.clear();
        window.location.href = '/login';
    }

    return result;
};

export default defaultFetchBaseQuery;
