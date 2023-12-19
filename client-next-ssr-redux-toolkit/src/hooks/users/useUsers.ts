import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';

import SsrContext from 'context/ssr';
import useResize from 'hooks/useResize';
import { useDeleteUserMutation, useFetchUsersQuery } from 'api/users';

import type { User } from 'types';

const useUsers = () => {
    let fetchUsersQueryResult;
    const {
        fetchErrors: { isUsersFetchFailed }
    } = useContext(SsrContext);

    const [isMounted, setIsMounted] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | undefined>();
    const [userToDelete, setUserToDelete] = useState<User | undefined>();
    const [deleteUser, deleteResult] = useDeleteUserMutation();

    if (!isUsersFetchFailed) {
        fetchUsersQueryResult = useFetchUsersQuery();
    }

    const {
        data: users = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = fetchUsersQueryResult || {};

    const { dimensionsForElement, tableRef } = useResize('users', users.length);

    const isMobile = dimensionsForElement
        ? dimensionsForElement.rowHeight! > dimensionsForElement.headerHeight!
        : false;

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
        setIsMounted(true);
    }, []);
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

    return isMounted
        ? {
              users,
              isError: isUsersFetchFailed ? true : isError,
              tableRef,
              isMobile,
              isMounted,
              isSuccess,
              isLoading,
              isFetching,
              userToEdit,
              userToDelete,
              dimensionsForElement,
              setUserToEdit,
              setUserToDelete,
              handleDeleteUser
          }
        : { isMounted };
};

export default useUsers;
