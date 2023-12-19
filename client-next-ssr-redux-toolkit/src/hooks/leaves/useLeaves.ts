import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';

import SsrContext from 'context/ssr';
import useResize from 'hooks/useResize';
import { useSelector } from 'react-redux';
import ProfileContext from 'context/profile';
import { useFetchUserLeavesQuery } from 'api/users';
import { isLoggedInAsAdmin } from 'reducers/authSlice';
import {
    useFetchLeavesQuery,
    useDeleteLeaveMutation,
    useConfirmLeaveMutation
} from 'api/leaves';

import type { Leave } from 'types';

const useLeaves = () => {
    let fetchLeavesQueryResult;
    const {
        fetchErrors: { isLeavesFetchFailed, isUserLeavesFetchFailed }
    } = useContext(SsrContext);

    const [isMounted, setIsMounted] = useState(false);
    const [leaveToEdit, setLeaveToEdit] = useState<Leave | undefined>();
    const [leaveToDelete, setLeaveToDelete] = useState<Leave | undefined>();
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);
    const { profileUserId } = useContext(ProfileContext);
    const [deleteLeave, deleteResult] = useDeleteLeaveMutation();
    const [confirmLeave, confirmResult] = useConfirmLeaveMutation();

    if (!isLeavesFetchFailed && profileUserId) {
        fetchLeavesQueryResult = useFetchUserLeavesQuery(profileUserId);
    }

    if (!isUserLeavesFetchFailed && !profileUserId) {
        fetchLeavesQueryResult = useFetchLeavesQuery();
    }

    const {
        data: leaves = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = fetchLeavesQueryResult || {};

    const { tableRef, dimensionsForElement } = useResize(
        'leaves',
        leaves.length
    );

    const isMobile = dimensionsForElement
        ? dimensionsForElement.rowHeight! > dimensionsForElement.headerHeight!
        : false;

    const handleDeleteLeave = async () => {
        if (leaveToDelete) {
            try {
                await deleteLeave(leaveToDelete.id);

                setLeaveToDelete!(undefined);
            } catch (error) {
                console.error(error);
                toast.error('Error during executing request');
            }
        }
    };
    const handleConfirmLeave = async (id: string) => {
        try {
            await confirmLeave(id);
        } catch (error) {
            console.error(error);
            toast.error('Error during executing request');
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);
    useEffect(() => {
        if (deleteResult.isError) {
            toast.error('Error during deleting leave');
        }
    }, [deleteResult.isError]);
    useEffect(() => {
        if (confirmResult.isError) {
            toast.error('Error during granting leave');
        }
    }, [confirmResult.isError]);
    useEffect(() => {
        if (deleteResult.isSuccess) {
            toast.success('Successfully deleted leave');
        }
    }, [deleteResult.isSuccess]);
    useEffect(() => {
        if (confirmResult.isSuccess) {
            toast.success('Successfully granted leave');
        }
    }, [confirmResult.isSuccess]);
    useEffect(() => {
        if (isError) {
            toast.error('Error during fetching leaves');
        }
    }, [isError]);

    return isMounted
        ? {
              leaves,
              isError,
              tableRef,
              isMobile,
              isSuccess,
              isMounted,
              isLoading,
              isFetching,
              leaveToEdit,
              leaveToDelete,
              isLoggedAsAdmin,
              dimensionsForElement,
              setLeaveToEdit,
              setLeaveToDelete,
              handleDeleteLeave,
              handleConfirmLeave
          }
        : { isMounted };
};

export default useLeaves;
