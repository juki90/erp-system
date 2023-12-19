import { StatusCodes } from 'http-status-codes';

import { usersApi } from 'api/users';
import UserLayout from 'layout/UserLayout';
import { contractsApi } from 'api/contracts';
import PageHeading from 'components/PageHeading';
import { setAuthCookie } from 'reducers/authSlice';
import ContractList from 'components/contracts/ContractList';
import { initializeStore, removeUndefined, type RootState } from 'store';

import type { FC } from 'react';
import type { GetServerSideProps } from 'next/types';
import type { GetServerSideContractProps } from 'types';

export const getServerSideProps: GetServerSideProps<
    GetServerSideContractProps
> = async context => {
    const { FORBIDDEN, UNAUTHORIZED } = StatusCodes;
    const {
        req: {
            headers: { cookie }
        }
    } = context;
    const props: GetServerSideContractProps = {};

    try {
        if (!cookie) {
            return { notFound: true };
        }

        const store = initializeStore();

        store.dispatch(setAuthCookie(cookie || ''));

        const [contracts, users] = await Promise.all([
            store.dispatch(contractsApi.endpoints.fetchContracts.initiate()),
            store.dispatch(usersApi.endpoints.fetchUsers.initiate())
        ]);

        if (contracts?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        props.fetchErrors = {};

        if (contracts?.isError) {
            if (
                'status' in contracts?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    contracts.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors.isContractsFetchFailed = true;
            }
        }

        if (users?.isError) {
            if (
                'status' in users?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(users.error.status as number)
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors.isUsersFetchFailed = true;
            }
        }
    } catch (error) {
        console.error('Error during fetching contracts on server side:', error);
    }

    return {
        props
    };
};

const ContractsPage: FC = () => (
    <UserLayout>
        <PageHeading>Contracts</PageHeading>
        <div className="pb-2">
            <p className="mb-3">
                Virtualized list of all contracts in the system
            </p>
            <ContractList />
        </div>
    </UserLayout>
);
export default ContractsPage;
