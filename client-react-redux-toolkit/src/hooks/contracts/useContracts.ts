import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect, useState, useContext } from 'react';
import type { Contract } from 'types';
import useResize from 'hooks/useResize';
import ProfileContext from 'context/profile';
import { isLoggedInAsAdmin } from 'reducers/authSlice';
import { useFetchUserContractsQuery } from 'api/users';
import {
    useDeleteContractMutation,
    useFetchContractsQuery
} from 'api/contracts';

const useContracts = () => {
    const [contractToEdit, setContractToEdit] = useState<
        Contract | undefined
    >();
    const [contractToDelete, setContractToDelete] = useState<
        Contract | undefined
    >();
    const { profileUserId } = useContext(ProfileContext);
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);
    const {
        data: contracts = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = profileUserId
        ? useFetchUserContractsQuery(profileUserId)
        : useFetchContractsQuery();
    const [deleteContract, deleteResult] = useDeleteContractMutation();
    const { tableRef, dimensionsForElement } = useResize(
        'contracts',
        contracts.length
    );
    const isMobile =
        dimensionsForElement.rowHeight! > dimensionsForElement.headerHeight!;

    const handleDeleteContract = async () => {
        if (contractToDelete) {
            try {
                await deleteContract(contractToDelete.id);

                setContractToDelete!(undefined);
            } catch (error) {
                console.error(error);
                toast.error('Error during executing request');
            }
        }
    };

    useEffect(() => {
        if (deleteResult.isError) {
            toast.error('Error during deleting contract');
        }
    }, [deleteResult.isError]);
    useEffect(() => {
        if (deleteResult.isSuccess) {
            toast.success('Successfully deleted contract');
        }
    }, [deleteResult.isSuccess]);
    useEffect(() => {
        if (isError) {
            toast.error('Error during fetching contracts');
        }
    }, [isError]);

    return {
        isError,
        tableRef,
        isMobile,
        contracts,
        isSuccess,
        isLoading,
        isFetching,
        contractToEdit,
        isLoggedAsAdmin,
        contractToDelete,
        dimensionsForElement,
        setContractToEdit,
        setContractToDelete,
        handleDeleteContract
    };
};

export default useContracts;
