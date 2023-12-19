import { StatusCodes } from 'http-status-codes';

import { usersApi } from 'api/users';
import { leavesApi } from 'api/leaves';
import UserLayout from 'layout/UserLayout';
import PageHeading from 'components/PageHeading';
import { setAuthCookie } from 'reducers/authSlice';
import LeaveList from 'components/leaves/LeaveList';
import { initializeStore, removeUndefined, type RootState } from 'store';

import type { FC } from 'react';
import type { GetServerSideProps } from 'next/types';
import type { GetServerSideLeavesProps } from 'types';

export const getServerSideProps: GetServerSideProps<
    GetServerSideLeavesProps
> = async context => {
    const { FORBIDDEN, UNAUTHORIZED } = StatusCodes;
    const {
        req: {
            headers: { cookie }
        }
    } = context;
    const props: GetServerSideLeavesProps = {};

    try {
        if (!cookie) {
            return { notFound: true };
        }

        const store = initializeStore();

        store.dispatch(setAuthCookie(cookie || ''));

        const [leaves, users] = await Promise.all([
            store.dispatch(leavesApi.endpoints.fetchLeaves.initiate()),
            store.dispatch(usersApi.endpoints.fetchUsers.initiate())
        ]);

        if (leaves?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        props.fetchErrors = {};

        if (leaves?.isError) {
            if (
                'status' in leaves?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    leaves.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors.isLeavesFetchFailed = true;
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
        console.error('Error during fetching leaves on server side:', error);
    }

    return {
        props
    };
};

const LeavesPage: FC = () => (
    <UserLayout>
        <PageHeading>Leaves</PageHeading>
        <div className="pb-2">
            <p className="mb-3">Virtualized list of all leaves in the system</p>
            <LeaveList />
        </div>
    </UserLayout>
);
export default LeavesPage;
