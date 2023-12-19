import { toast } from 'react-toastify';
import type { SingleValue } from 'react-select';
import { useEffect, useContext, useState } from 'react';
import { User } from 'types';
import { useGetMeQuery } from 'api/auth';
import ProfileContext from 'context/profile';
import { useFetchUsersQuery, useGetUserQuery } from 'api/users';

const useUserPicker = (
    preselectedUserId: string | undefined,
    setSelectedUser: (
        newValue: SingleValue<{ value: string; label: string }>
    ) => void
) => {
    const [preselectedUserOption, setPreselectedUserOption] = useState<
        { value: string; label: string } | undefined
    >();
    const [usersOptions, setUsersOptions] = useState<
        { value: string; label: string }[] | undefined
    >();
    const { isProfileView, profileUserId } = useContext(ProfileContext);
    const {
        data: fetchData,
        isSuccess,
        isError = null
    } = isProfileView
        ? profileUserId
            ? useGetUserQuery(profileUserId)
            : useGetMeQuery()
        : useFetchUsersQuery();

    const setUserSettingsForAdminListView = () => {
        if (!profileUserId && !isProfileView && (fetchData as User[]).length) {
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
        }
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

        setUserSettingsForAdminListView();
        setUserSettingsForProfileView();
    }, [isSuccess]);
    useEffect(() => {
        if (isError) {
            toast.error('Error during fetching users');
        }
    }, [isError]);

    return {
        usersOptions,
        isProfileView,
        preselectedUserOption
    };
};

export default useUserPicker;
