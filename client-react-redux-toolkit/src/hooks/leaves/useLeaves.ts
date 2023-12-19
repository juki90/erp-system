import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect, useState, useContext } from 'react';
import type { Leave } from 'types';
import useResize from 'hooks/useResize';
import ProfileContext from 'context/profile';
import { isLoggedInAsAdmin } from 'reducers/authSlice';
import { useFetchUserLeavesQuery } from 'api/users';
import {
    useDeleteLeaveMutation,
    useConfirmLeaveMutation,
    useFetchLeavesQuery
} from 'api/leaves';

const useLeaves = () => {
    const [leaveToEdit, setLeaveToEdit] = useState<Leave | undefined>();
    const [leaveToDelete, setLeaveToDelete] = useState<Leave | undefined>();
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);
    const { profileUserId } = useContext(ProfileContext);
    const {
        data: leaves = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = profileUserId
        ? useFetchUserLeavesQuery(profileUserId)
        : useFetchLeavesQuery();
    const [deleteLeave, deleteResult] = useDeleteLeaveMutation();
    const [confirmLeave, confirmResult] = useConfirmLeaveMutation();
    const { tableRef, dimensionsForElement } = useResize(
        'leaves',
        leaves.length
    );

    const isMobile =
        dimensionsForElement.rowHeight! > dimensionsForElement.headerHeight!;

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

    return {
        leaves,
        isError,
        tableRef,
        isMobile,
        isSuccess,
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
    };
};

export default useLeaves;
