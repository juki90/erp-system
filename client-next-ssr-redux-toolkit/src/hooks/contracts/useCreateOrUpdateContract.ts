import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { SingleValue } from 'react-select';
import { FieldValues, useForm, type UseFormSetError } from 'react-hook-form';
import { useEffect, useContext, type MouseEventHandler, useState } from 'react';

import useModal from 'hooks/useModal';
import ProfileContext from 'context/profile';
import { DATE_FORMAT } from 'config/constants';
import ContractContext from 'context/contracts';
import errorConverter from 'helpers/errorConverter';
import createOrUpdateContractValidation from 'validations/contracts/createOrUpdateContract';
import {
    useStoreContractMutation,
    useUpdateContractMutation
} from 'api/contracts';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import type { ContractCreateRequest, ContractUpdateRequest } from 'types';

const useCreateOrUpdateContract = () => {
    const [endDate, setEndDate] = useState<string>('');
    const { contractToEdit, setContractToEdit } = useContext(ContractContext);
    const { isProfileView } = useContext(ProfileContext);
    const [saveContract, result] = contractToEdit
        ? useUpdateContractMutation()
        : useStoreContractMutation();

    const initialValues = contractToEdit
        ? {
              id: contractToEdit.id,
              userId: contractToEdit.userId,
              startDate: contractToEdit.startDate,
              duration: contractToEdit.duration,
              daysOff: `${contractToEdit.daysOff}`
          }
        : {
              startDate: dayjs().format(DATE_FORMAT),
              duration: 12,
              daysOff: '20'
          };

    const { isOpen, modalStyles, handleModalOpen, handleModalClose } =
        useModal();
    const {
        formState: { errors },
        reset,
        watch,
        register,
        setError,
        setValue,
        getValues,
        clearErrors,
        handleSubmit
    } = useForm<ContractCreateRequest | ContractUpdateRequest>({
        defaultValues: initialValues,
        reValidateMode: 'onChange',
        mode: 'onSubmit'
    });

    const userIdWatcher = watch('userId');
    const startDateWatcher = watch('startDate');
    const durationWatcher = watch('duration');

    const startDateFieldProps = register(
        'startDate',
        createOrUpdateContractValidation.startDate
    );
    const durationFieldProps = register(
        'duration',
        createOrUpdateContractValidation.duration
    );
    const daysOffFieldProps = register(
        'daysOff',
        createOrUpdateContractValidation.daysOff
    );

    register('userId', createOrUpdateContractValidation.userId);

    if (contractToEdit) {
        register('id');
    }

    const handleChangeStartDate = (date: Date | null | undefined) => {
        setValue('startDate', dayjs(date || undefined).format(DATE_FORMAT));
    };
    const handleUserChange = (
        newValue: SingleValue<{ value: string; label: string }>
    ) => {
        setValue('userId', newValue!.value);
        clearErrors('userId');
    };
    const handleOpenContractModal = () => {
        reset(initialValues);
        handleModalOpen();
    };
    const handleCloseContractModal: MouseEventHandler<
        HTMLButtonElement
    > = e => {
        e.preventDefault();
        setContractToEdit!(undefined);
        handleModalClose();
    };
    const onSubmit = handleSubmit(async data => {
        try {
            await saveContract(
                data as ContractCreateRequest & ContractUpdateRequest
            );
        } catch (error) {
            console.error(error);

            toast.error('Error during executing request');
        }
    });

    useEffect(() => {
        if (result.isError) {
            errorConverter({
                error: result.error as FetchBaseQueryError,
                setError: setError as UseFormSetError<FieldValues>,
                handleNotFound: () => {
                    toast.error('This contract does not exist anymore');
                    setContractToEdit!(undefined);
                    handleModalClose();
                }
            });
        }
    }, [result.isError]);
    useEffect(() => {
        if (contractToEdit) {
            handleOpenContractModal();
        }
    }, [contractToEdit]);
    useEffect(() => {
        if (errors.startDate || errors.duration) {
            clearErrors(['startDate', 'duration']);
            result.reset();
        }
    }, [startDateWatcher, durationWatcher]);
    useEffect(() => {
        if (result.isSuccess) {
            handleModalClose();
            setContractToEdit!(undefined);
            reset(initialValues);
            result.reset();
            toast.success(
                `Successfully ${
                    contractToEdit ? 'updated' : 'created'
                } contract`
            );
        }
    }, [result.isSuccess]);
    useEffect(() => {
        setEndDate(
            dayjs(startDateWatcher)
                .add(durationWatcher, 'M')
                .subtract(1, 'd')
                .format(DATE_FORMAT)
        );
    }, [startDateWatcher, durationWatcher]);

    return {
        isOpen,
        errors,
        endDate,
        modalStyles,
        isProfileView,
        userIdWatcher,
        contractToEdit,
        durationWatcher,
        startDateWatcher,
        daysOffFieldProps,
        durationFieldProps,
        startDateFieldProps,
        isLoading: result.isLoading,
        contractToEditUserId: initialValues.userId,
        onSubmit,
        getValues,
        handleUserChange,
        handleChangeStartDate,
        handleOpenContractModal,
        handleCloseContractModal
    };
};

export default useCreateOrUpdateContract;
