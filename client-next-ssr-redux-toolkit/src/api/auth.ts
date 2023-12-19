import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';

import { setAuthCookie } from 'reducers/authSlice';
import defaultFetchBaseQuery from 'plugins/fetchBaseQuery';

import type {
    LoginResponse,
    LoginRequest,
    User,
    ResetPasswordRequest,
    ResetPasswordRequestRequest
} from 'types';

export const authApi = createApi({
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },

    reducerPath: 'authApi',

    baseQuery: defaultFetchBaseQuery,

    tagTypes: ['Me'],

    endpoints: builder => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: credentials,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                const fulfilledData = await queryFulfilled;

                const authCookie = (
                    fulfilledData.meta as {
                        response: { headers: Map<string, string> };
                    }
                ).response.headers.get('auth-cookie');

                dispatch(setAuthCookie(authCookie || ''));
            }
        }),

        logout: builder.mutation<string, void>({
            query: () => ({
                url: '/logout',
                method: 'GET',
                responseHandler: response => response.text()
            })
        }),

        getMe: builder.query<User, void>({
            query: () => ({
                url: '/me',
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: ['Me']
        }),

        requestPasswordReset: builder.mutation<
            string,
            ResetPasswordRequestRequest
        >({
            query: credentials => ({
                url: '/reset-password',
                method: 'POST',
                body: credentials
            })
        }),

        checkPasswordResetRequest: builder.query<string, string>({
            query: token => ({
                url: `/reset-password/${token}`,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            })
        }),

        resetPassword: builder.mutation<
            string,
            { token: string } & ResetPasswordRequest
        >({
            query: ({ token, ...credentials }) => ({
                url: `/reset-password/${token}`,
                method: 'POST',
                body: credentials,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            })
        })
    })
});

export const {
    useGetMeQuery,
    useLoginMutation,
    useLogoutMutation,
    useResetPasswordMutation,
    useRequestPasswordResetMutation
} = authApi;
