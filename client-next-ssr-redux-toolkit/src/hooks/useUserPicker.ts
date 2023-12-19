import { toast } from 'react-toastify';
import { useEffect, useContext, useState } from 'react';

import SsrContext from 'context/ssr';
import { useGetMeQuery } from 'api/auth';
import ProfileContext from 'context/profile';
import { useFetchUsersQuery, useGetUserQuery } from 'api/users';

import type { User } from 'types';
import type { SingleValue } from 'react-select';

const useUserPicker = (
    preselectedUserId: string | undefined,
    setSelectedUser: (
        newValue: SingleValue<{ value: string; label: string }>
    ) => void
) => {
    let fetchUserOrUsersQueryResult;

    const [preselectedUserOption, setPreselectedUserOption] = useState<
        { value: string; label: string } | undefined
    >();
    const [usersOptions, setUsersOptions] = useState<
        { value: string; label: string }[] | undefined
    >();
    const { isProfileView, profileUserId } = useContext(ProfileContext);
    const {
        fetchErrors: { isUsersFetchFailed }
    } = useContext(SsrContext);

    if (!isUsersFetchFailed) {
        fetchUserOrUsersQueryResult = isProfileView
            ? profileUserId
                ? useGetUserQuery(profileUserId)
                : useGetMeQuery()
            : useFetchUsersQuery();
    }

    const {
        data: fetchData,
        isSuccess,
        isError = null
    } = fetchUserOrUsersQueryResult || {};

    const setUserSettingsForAdminListView = () => {
        const selectedUser = (fetchData as User[]).find(
            ({ id }) => id === preselectedUserId
        );

        if (!selectedUser && preselectedUserId) {
            toast.error('User to edit does not exist anymore');

            return;
        }

        if (!preselectedUserId) {
            setPreselectedUserOption(undefined);
        } else {
            const { id, email, fullName } = selectedUser as User;

            setPreselectedUserOption({
                value: id,
                label: `${fullName} (${email})`
            });
        }

        setUsersOptions(
            (fetchData as User[]).map(({ id, fullName, email }) => ({
                value: id,
                label: `${fullName} (${email})`
            }))
        );
    };

    const setUserSettingsForProfileView = () => {
        if (isProfileView) {
            const { id, fullName, email } = fetchData as User;

            const preselectedUser = {
                value: id,
                label: `${fullName} (${email})`
            };

            setUsersOptions([preselectedUser]);
            setPreselectedUserOption(preselectedUser);
            setSelectedUser(preselectedUser);
        }
    };

    useEffect(() => {
        if (!isSuccess) {
            return;
        }

        if ((fetchData as User[]).length) {
            setUserSettingsForAdminListView();
        }

        if (isProfileView) {
            setUserSettingsForProfileView();
        }
    }, [isSuccess]);
    useEffect(() => {
        if (isError || isUsersFetchFailed) {
            toast.error('Error during fetching users');
        }
    }, [isError]);

    return {
        usersOptions,
        preselectedUserOption
    };
};

export default useUserPicker;
