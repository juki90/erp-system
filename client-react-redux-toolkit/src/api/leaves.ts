import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBaseQuery from 'plugins/fetchBaseQuery';
import authApi from 'api/auth';
import usersApi from 'api/users';
import type {
    LeaveCreateRequest,
    LeaveUpdateRequest,
    LeaveCreateResponse,
    LeaveUpdateResponse,
    Leave
} from 'types';

export const leavesApi = createApi({
    reducerPath: 'leavesApi',

    tagTypes: ['Leaves'],

    baseQuery: fetchBaseQuery,

    endpoints: builder => ({
        fetchLeaves: builder.query<Leave[], void>({
            query: () => ({
                url: '/leaves',
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: ['Leaves']
        }),

        storeLeave: builder.mutation<LeaveCreateResponse, LeaveCreateRequest>({
            query: leave => ({
                url: '/leaves',
                method: 'POST',
                body: leave,
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
                try {
                    await queryFulfilled;

                    dispatch(
                        usersApi.util.invalidateTags([
                            'Users',
                            { type: 'Leaves', id: args.userId }
                        ])
                    );
                    dispatch(authApi.util.invalidateTags(['Me']));
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Leaves']
        }),

        updateLeave: builder.mutation<LeaveUpdateResponse, LeaveUpdateRequest>({
            query: leave => ({
                url: `/leaves/${leave.id}`,
                method: 'PUT',
                body: leave,
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
                try {
                    await queryFulfilled;

                    dispatch(
                        usersApi.util.invalidateTags([
                            'Users',
                            { type: 'Leaves', id: args.userId }
                        ])
                    );
                    dispatch(authApi.util.invalidateTags(['Me']));
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Leaves']
        }),

        confirmLeave: builder.mutation<string, string>({
            query: id => ({
                url: `/leaves/${id}/confirm`,
                method: 'PUT',
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
                try {
                    await queryFulfilled;

                    dispatch(usersApi.util.invalidateTags(['Users', 'Leaves']));
                    dispatch(authApi.util.invalidateTags(['Me']));
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Leaves']
        }),

        deleteLeave: builder.mutation<string, string>({
            query: id => ({
                url: `/leaves/${id}`,
                method: 'DELETE'
            }),

            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;

                    dispatch(usersApi.util.invalidateTags(['Users', 'Leaves']));
                    dispatch(authApi.util.invalidateTags(['Me']));
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Leaves']
        })
    })
});

export const {
    useFetchLeavesQuery,
    useStoreLeaveMutation,
    useUpdateLeaveMutation,
    useConfirmLeaveMutation,
    useDeleteLeaveMutation
} = leavesApi;
