import { useRouter } from 'next/router';
import { StatusCodes } from 'http-status-codes';

import { usersApi } from 'api/users';
import UserLayout from 'layout/UserLayout';
import ProfileContext from 'context/profile';
import PageHeading from 'components/PageHeading';
import { setAuthCookie } from 'reducers/authSlice';
import LeaveList from 'components/leaves/LeaveList';
import ProfileBoard from 'components/profile/ProfileBoard';
import ContractList from 'components/contracts/ContractList';
import { RootState, initializeStore, removeUndefined } from 'store';

import type { FC } from 'react';
import type { GetServerSideProps } from 'next';
import type { GetServerSideUserProfileProps } from 'types';

export const getServerSideProps: GetServerSideProps<
    GetServerSideUserProfileProps
> = async context => {
    const { FORBIDDEN, UNAUTHORIZED, NOT_FOUND } = StatusCodes;
    const {
        req: {
            headers: { cookie }
        }
    } = context;
    const userId = context.params!.id as string;
    const props: GetServerSideUserProfileProps = { fetchErrors: {} };

    try {
        if (!cookie) {
            return { notFound: true };
        }

        const store = initializeStore();

        store.dispatch(setAuthCookie(cookie || ''));

        const [user, userContracts, userLeaves] = await Promise.all([
            store.dispatch(usersApi.endpoints.getUser.initiate(userId)),
            store.dispatch(
                usersApi.endpoints.fetchUserContracts.initiate(userId)
            ),
            store.dispatch(usersApi.endpoints.fetchUserLeaves.initiate(userId))
        ]);

        if (user?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (userContracts?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (userLeaves?.isSuccess) {
            props.initialReduxState = removeUndefined(
                store.getState()
            ) as RootState;
        }

        if (user?.isError) {
            if (
                'status' in user?.error &&
                [FORBIDDEN, UNAUTHORIZED, NOT_FOUND].includes(
                    user.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors!.isUserFetchFailed = true;
            }
        }

        if (userContracts?.isError) {
            if (
                'status' in userContracts?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    userContracts.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors!.isUserContractsFetchFailed = true;
            }
        }

        if (userLeaves?.isError) {
            if (
                'status' in userLeaves?.error &&
                [FORBIDDEN, UNAUTHORIZED].includes(
                    userLeaves.error.status as number
                )
            ) {
                return { notFound: true };
            } else {
                props.fetchErrors!.isUserLeavesFetchFailed = true;
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
    const router = useRouter();

    return (
        <UserLayout>
            <ProfileContext.Provider
                value={{
                    isProfileView: true,
                    profileUserId: router?.query?.id as string
                }}
            >
                <PageHeading>User Profile</PageHeading>
                <ProfileBoard />
                <hr className="mx-2 my-4" />
                <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                    User's contracts
                </h2>
                <p className="mb-4">Virtualized list of contracts</p>
                <ContractList />
                <hr className="mx-2 my-4" />
                <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                    User's leaves
                </h2>
                <p className="mb-4">Virtualized list of leaves</p>
                <LeaveList />
            </ProfileContext.Provider>
        </UserLayout>
    );
};

export default ProfilePage;
