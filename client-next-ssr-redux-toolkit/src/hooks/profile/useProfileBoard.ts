import { useContext } from 'react';

import { ROLES } from 'config/constants';
import { useGetMeQuery } from 'api/auth';
import { useGetUserQuery } from 'api/users';
import ProfileContext from 'context/profile';

const useProfileBoard = () => {
    const { profileUserId } = useContext(ProfileContext);
    const {
        data: viewedProfileUser,
        isSuccess,
        isError,
        isLoading,
        isFetching
    } = profileUserId ? useGetUserQuery(profileUserId) : useGetMeQuery();
    const isLoggedAsAdmin = viewedProfileUser
        ? viewedProfileUser?.roles?.some(
              ({ name }: { name: string }) => name === ROLES.ADMIN
          )
        : false;

    return {
        isError,
        isLoading,
        isSuccess,
        isFetching,
        isLoggedAsAdmin,
        viewedProfileUser
    };
};

export default useProfileBoard;
