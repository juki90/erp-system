import { StatusCodes } from 'http-status-codes';

import { authApi } from 'api/auth';
import { leavesApi } from 'api/leaves';
import UserLayout from 'layout/UserLayout';
import ProfileContext from 'context/profile';
import { contractsApi } from 'api/contracts';
import PageHeading from 'components/PageHeading';
import { setAuthCookie } from 'reducers/authSlice';
import LeaveList from 'components/leaves/LeaveList';
import ProfileBoard from 'components/profile/ProfileBoard';
import ContractList from 'components/contracts/ContractList';
import { RootState, initializeStore, removeUndefined } from 'store';

import type { FC } from 'react';
import type { GetServerSideProps } from 'next';
import type { GetServerSideProfileProps } from 'types';

export const getServerSideProps: GetServerSideProps<
    GetServerSideProfileProps
> = async context => {
    const { FORBIDDEN, UNAUTHORIZED } = StatusCodes;
    const {
        req: {
            headers: { cookie }
        }
    } = context;
    const props: GetServerSideProfileProps = { fetchErrors: {} };

    try {
        if (!cookie) {
            return { notFound: true };
        }

        const store = initializeStore();

        store.dispatch(setAuthCookie(cookie || ''));

        const [me, contracts, leaves] = await Promise.all([
            store.dispatch(authApi.endpoints.getMe.initiate()),
            store.dispatch(contractsApi.endpoints.fetchContracts.initiate()),
            store.dispatch(leavesApi.endpoints.fetchLeaves.initiate())
        ]);

        if (me?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (contracts?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (leaves?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (me?.isError) {
            if (
                'status' in me?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(me.error.status as number)
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors!.isMeFetchFailed = true;
            }
        }

        if (contracts?.isError) {
            if (
                'status' in contracts?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    contracts.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors!.isContractsFetchFailed = true;
            }
        }

        if (leaves?.isError) {
            if (
                'status' in leaves?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    leaves.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors!.isLeavesFetchFailed = true;
            }
        }
    } catch (error) {
        console.error('Error during fetching profile on server side:', error);
    }

    return {
        props
    };
};

const ProfilePage: FC = () => {
    return (
        <UserLayout>
            <ProfileContext.Provider
                value={{ isProfileView: true, profileUserId: undefined }}
            >
                <PageHeading>My Profile</PageHeading>
                <ProfileBoard />
                <hr className="mx-2 my-4" />
                <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                    My contracts
                </h2>
                <p className="mb-4">List of contracts</p>
                <ContractList />
                <hr className="mx-2 my-4" />
                <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                    My leaves
                </h2>
                <p className="mb-4">List of leaves</p>
                <LeaveList />
            </ProfileContext.Provider>
        </UserLayout>
    );
};

export default ProfilePage;
