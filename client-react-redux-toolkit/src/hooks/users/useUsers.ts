import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { User } from 'types';
import useResize from 'hooks/useResize';
import { useFetchUsersQuery, useDeleteUserMutation } from 'api/users';

const useUsers = () => {
    const [userToEdit, setUserToEdit] = useState<User | undefined>();
    const [userToDelete, setUserToDelete] = useState<User | undefined>();
    const {
        data: users = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = useFetchUsersQuery();
    const [deleteUser, deleteResult] = useDeleteUserMutation();
    const { dimensionsForElement, tableRef } = useResize('users', users.length);
    const isMobile =
        dimensionsForElement.rowHeight! > dimensionsForElement.headerHeight!;

    const handleDeleteUser = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.id);

                setUserToDelete!(undefined);
            } catch (error) {
                console.error(error);
                toast.error('Error during executing request');
            }
        }
    };

    useEffect(() => {
        if (deleteResult.isError) {
            toast.error('Error during deleting user');
        }
    }, [deleteResult.isError]);
    useEffect(() => {
        if (deleteResult.isSuccess) {
            toast.success('Successfully deleted user');
        }
    }, [deleteResult.isSuccess]);
    useEffect(() => {
        if (isError) {
            toast.error('Error during fetching users');
        }
    }, [isError]);

    return {
        users,
        isError,
        tableRef,
        isMobile,
        isSuccess,
        isLoading,
        userToEdit,
        isFetching,
        userToDelete,
        dimensionsForElement,
        setUserToEdit,
        setUserToDelete,
        handleDeleteUser
    };
};

export default useUsers;
