import dayjs from 'dayjs';

import { DATE_FORMAT } from 'config/constants';
import useProfileBoard from 'hooks/profile/useProfileBoard';

import type { FC } from 'react';

const ProfileBoard: FC = () => {
    const {
        isSuccess,
        isError,
        isLoading,
        isFetching,
        isLoggedAsAdmin,
        viewedProfileUser
    } = useProfileBoard();

    return (
        <>
            {isSuccess && viewedProfileUser ? (
                <>
                    <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                        Profile information
                    </h2>
                    <p className="mb-4">
                        Role: <b>{isLoggedAsAdmin ? 'ADMIN' : 'USER'}</b>
                    </p>
                    <ul>
                        <li>
                            User ID: <b>{viewedProfileUser.id}</b>
                        </li>
                        <li>
                            First name: <b>{viewedProfileUser.firstName}</b>
                        </li>
                        <li>
                            Last name: <b>{viewedProfileUser.lastName}</b>
                        </li>
                        <li>
                            Email: <b>{viewedProfileUser.email}</b>
                        </li>
                        <li>
                            Birth date: <b>{viewedProfileUser.birthDate}</b>
                        </li>
                        <li>
                            Leave days:{' '}
                            <b>{viewedProfileUser.numberOfLeaveDays}</b>
                        </li>
                        <li>
                            Joined at:{' '}
                            <b>
                                {dayjs(viewedProfileUser.createdAt).format(
                                    DATE_FORMAT
                                )}
                            </b>
                        </li>
                        <li>
                            Recent profile update at:{' '}
                            <b>
                                {dayjs(viewedProfileUser.updatedAt).format(
                                    DATE_FORMAT
                                )}
                            </b>
                        </li>
                    </ul>
                </>
            ) : null}
            {!viewedProfileUser && (isLoading || isFetching) ? (
                <div className="text-[125%] py-5 w-[90px] mx-auto text-center text-bold">
                    <div className="h-[90px] w-[90px] mx-auto animate-spin rounded-full border-4 border-solid border-gray-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <small className="text-center text-gray-600">
                        Loading...
                    </small>
                </div>
            ) : null}
            {isError ? (
                <p className="text-[125%] my-4 text-center text-red-800">
                    Error during fetching profile, please check later
                </p>
            ) : null}
        </>
    );
};

export default ProfileBoard;
