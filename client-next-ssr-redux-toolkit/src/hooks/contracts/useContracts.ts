import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';

import SsrContext from 'context/ssr';
import useResize from 'hooks/useResize';
import ProfileContext from 'context/profile';
import { isLoggedInAsAdmin } from 'reducers/authSlice';
import { useFetchUserContractsQuery } from 'api/users';
import {
    useDeleteContractMutation,
    useFetchContractsQuery
} from 'api/contracts';

import type { Contract } from 'types';

const useContracts = () => {
    let fetchContractsQueryResult;
    const [contractToEdit, setContractToEdit] = useState<
        Contract | undefined
    >();
    const [contractToDelete, setContractToDelete] = useState<
        Contract | undefined
    >();
    const { profileUserId } = useContext(ProfileContext);
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);
    const {
        fetchErrors: { isContractsFetchFailed, isUserContractsFetchFailed }
    } = useContext(SsrContext);

    const [isMounted, setIsMounted] = useState(false);

    if (!isContractsFetchFailed && profileUserId) {
        fetchContractsQueryResult = useFetchUserContractsQuery(profileUserId);
    }

    if (!isUserContractsFetchFailed && !profileUserId) {
        fetchContractsQueryResult = useFetchContractsQuery();
    }

    const {
        data: contracts = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = fetchContractsQueryResult || {};

    const [deleteContract, deleteResult] = useDeleteContractMutation();
    const { tableRef, dimensionsForElement } = useResize(
        'contracts',
        contracts.length
    );
    const isMobile = dimensionsForElement
        ? dimensionsForElement.rowHeight! > dimensionsForElement.headerHeight!
        : false;

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
        setIsMounted(true);
    }, []);
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

    return isMounted
        ? {
              isError: isContractsFetchFailed ? true : isError,
              tableRef,
              isMobile,
              contracts,
              isSuccess,
              isMounted,
              isLoading,
              isFetching,
              contractToEdit,
              isLoggedAsAdmin,
              contractToDelete,
              dimensionsForElement,
              setContractToEdit,
              setContractToDelete,
              handleDeleteContract
          }
        : { isMounted };
};

export default useContracts;
