import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBaseQuery from 'plugins/fetchBaseQuery';
import type {
    UserCreateRequest,
    UserUpdateRequest,
    UserCreateResponse,
    UserUpdateResponse,
    User,
    Leave,
    Contract
} from 'types';

export const usersApi = createApi({
    reducerPath: 'usersApi',

    tagTypes: ['Users', 'Contracts', 'Leaves'],

    baseQuery: fetchBaseQuery,

    endpoints: builder => ({
        fetchUsers: builder.query<User[], void>({
            query: () => ({
                url: '/users',
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: ['Users']
        }),

        getUser: builder.query<User, string>({
            query: id => ({
                url: `/users/${id}`,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: (result, error, id) => [{ type: 'Users', id }]
        }),

        storeUser: builder.mutation<UserCreateResponse, UserCreateRequest>({
            query: user => ({
                url: '/users',
                method: 'POST',
                body: user,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            invalidatesTags: ['Users']
        }),

        updateUser: builder.mutation<UserUpdateResponse, UserUpdateRequest>({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: user,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            invalidatesTags: ['Users']
        }),

        deleteUser: builder.mutation<string, string>({
            query: id => ({
                url: `/users/${id}`,
                method: 'DELETE'
            }),

            invalidatesTags: ['Users']
        }),

        fetchUserContracts: builder.query<Contract[], string>({
            query: id => ({
                url: `/users/${id}/contracts`,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: (result, error, id) => [{ type: 'Contracts', id }]
        }),

        fetchUserLeaves: builder.query<Leave[], string>({
            query: id => ({
                url: `/users/${id}/leaves`,
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: (result, error, id) => [{ type: 'Leaves', id }]
        })
    })
});

export const {
    useGetUserQuery,
    useFetchUsersQuery,
    useStoreUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useFetchUserLeavesQuery,
    useFetchUserContractsQuery
} = usersApi;

export default usersApi;
