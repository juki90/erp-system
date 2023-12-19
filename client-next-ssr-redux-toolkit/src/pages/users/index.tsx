import { StatusCodes } from 'http-status-codes';

import { usersApi } from 'api/users';
import UserLayout from 'layout/UserLayout';
import UserList from 'components/users/UserList';
import PageHeading from 'components/PageHeading';
import { setAuthCookie } from 'reducers/authSlice';
import { initializeStore, removeUndefined, type RootState } from 'store';

import type { FC } from 'react';
import type { GetServerSideUserProps } from 'types';
import type { GetServerSideProps } from 'next/types';

export const getServerSideProps: GetServerSideProps<
    GetServerSideUserProps
> = async context => {
    const { FORBIDDEN, UNAUTHORIZED } = StatusCodes;
    const {
        req: {
            headers: { cookie }
        }
    } = context;
    const props: GetServerSideUserProps = { fetchErrors: {} };

    try {
        if (!cookie) {
            return { notFound: true };
        }

        const store = initializeStore();

        store.dispatch(setAuthCookie(cookie || ''));

        const result = await store.dispatch(
            usersApi.endpoints.fetchUsers.initiate()
        );

        if (result?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (result?.isError) {
            props.fetchErrors = {};

            if (
                'status' in result?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    result.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors.isUsersFetchFailed = true;
            }
        }
    } catch (error) {
        console.error('Error during fetching users on server side:', error);
    }

    return {
        props
    };
};

const UsersPage: FC = () => (
    <UserLayout>
        <PageHeading>Users</PageHeading>
        <div className="pb-2">
            <p className="mb-3">Virtualized list of all users in the system</p>
            <UserList />
        </div>
    </UserLayout>
);
export default UsersPage;
