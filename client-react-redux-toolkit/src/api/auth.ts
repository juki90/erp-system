import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBaseQuery from 'plugins/fetchBaseQuery';
import type {
    User,
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest,
    ResetPasswordRequestRequest
} from 'types';

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery: fetchBaseQuery,

    tagTypes: ['Me'],

    endpoints: builder => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: credentials
            })
        }),

        logout: builder.mutation<string, void>({
            query: () => ({
                url: '/logout',
                method: 'GET',
                responseHandler: response => response.text()
            })
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
        })
    })
});

export const {
    useGetMeQuery,
    useLoginMutation,
    useLogoutMutation,
    useResetPasswordMutation,
    useRequestPasswordResetMutation,
    useCheckPasswordResetRequestQuery
} = authApi;

export default authApi;
