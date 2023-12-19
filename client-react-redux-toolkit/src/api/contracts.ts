import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBaseQuery from 'plugins/fetchBaseQuery';
import usersApi from 'api/users';
import type {
    ContractCreateRequest,
    ContractUpdateRequest,
    ContractCreateResponse,
    ContractUpdateResponse,
    Contract
} from 'types';

export const contractsApi = createApi({
    reducerPath: 'contractsApi',

    tagTypes: ['Contracts'],

    baseQuery: fetchBaseQuery,

    endpoints: builder => ({
        fetchContracts: builder.query<Contract[], void>({
            query: () => ({
                url: '/contracts',
                responseHandler: async response => {
                    const result = await response.text();

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }
            }),

            providesTags: ['Contracts']
        }),

        storeContract: builder.mutation<
            ContractCreateResponse,
            ContractCreateRequest
        >({
            query: contract => ({
                url: '/contracts',
                method: 'POST',
                body: contract,
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
                            { type: 'Contracts', id: args.userId }
                        ])
                    );
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Contracts']
        }),

        updateContract: builder.mutation<
            ContractUpdateResponse,
            ContractUpdateRequest
        >({
            query: contract => ({
                url: `/contracts/${contract.id}`,
                method: 'PUT',
                body: contract,
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
                            { type: 'Contracts', id: args.userId }
                        ])
                    );
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Contracts']
        }),

        deleteContract: builder.mutation<string, string>({
            query: id => ({
                url: `/contracts/${id}`,
                method: 'DELETE'
            }),

            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;

                    dispatch(
                        usersApi.util.invalidateTags(['Users', 'Contracts'])
                    );
                } catch (e) {
                    console.error(e);
                }
            },

            invalidatesTags: ['Contracts']
        })
    })
});

export const {
    useFetchContractsQuery,
    useStoreContractMutation,
    useUpdateContractMutation,
    useDeleteContractMutation
} = contractsApi;
