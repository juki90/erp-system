import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect, useContext, type MouseEventHandler } from 'react';

import useModal from 'hooks/useModal';
import LeaveContext from 'context/leaves';
import ProfileContext from 'context/profile';
import { DATE_FORMAT } from 'config/constants';
import errorConverter from 'helpers/errorConverter';
import { getLoggedUser, isLoggedInAsAdmin } from 'reducers/authSlice';
import { useStoreLeaveMutation, useUpdateLeaveMutation } from 'api/leaves';
import createOrUpdateLeaveValidation from 'validations/leaves/createOrUpdateLeave';
import {
    useForm,
    type UseFormSetError,
    type FieldValues
} from 'react-hook-form';

import type { SingleValue } from 'react-select';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import type { LeaveCreateRequest, LeaveUpdateRequest } from 'types';

const useCreateOrUpdateLeave = () => {
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);
    const { isProfileView } = useContext(ProfileContext);
    const loggedUser = useSelector(getLoggedUser);
    const { leaveToEdit, setLeaveToEdit } = useContext(LeaveContext);
    const [saveLeave, result] = leaveToEdit
        ? useUpdateLeaveMutation()
        : useStoreLeaveMutation();

    const initialValues = leaveToEdit
        ? {
              id: leaveToEdit.id,
              userId: leaveToEdit.userId,
              startDate: leaveToEdit.startDate,
              endDate: leaveToEdit.endDate,
              isConfirmed: leaveToEdit.isConfirmed
          }
        : {
              startDate: dayjs().format(DATE_FORMAT),
              endDate: dayjs().format(DATE_FORMAT),
              isConfirmed: !!isLoggedAsAdmin
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
        clearErrors,
        handleSubmit
    } = useForm<LeaveCreateRequest | LeaveUpdateRequest>({
        defaultValues: initialValues,
        reValidateMode: 'onChange',
        mode: 'onSubmit'
    });

    const userIdWatcher = watch('userId');
    const startDateWatcher = watch('startDate');
    const endDateWatcher = watch('endDate');

    const startDateFieldProps = register(
        'startDate',
        createOrUpdateLeaveValidation.startDate
    );
    const endDateFieldProps = register(
        'endDate',
        createOrUpdateLeaveValidation.endDate
    );
    const isConfirmedFieldProps = register('isConfirmed');

    register('userId', createOrUpdateLeaveValidation.userId);

    if (leaveToEdit) {
        register('id');
    }

    if (!isLoggedAsAdmin && loggedUser) {
        initialValues.userId = loggedUser.id;
    }

    const handleChangeStartDate = (date: Date | null | undefined) => {
        setValue('startDate', dayjs(date || undefined).format(DATE_FORMAT));
    };
    const handleChangeEndDate = (date: Date | null | undefined) => {
        setValue('endDate', dayjs(date || undefined).format(DATE_FORMAT));
    };
    const handleUserChange = (
        newValue: SingleValue<{ value: string; label: string }>
    ) => {
        setValue('userId', newValue!.value);
        clearErrors('userId');
    };
    const handleOpenLeaveModal = () => {
        reset(initialValues);
        handleModalOpen();
    };
    const handleCloseLeaveModal: MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault();
        setLeaveToEdit!(undefined);
        handleModalClose();
    };
    const onSubmit = handleSubmit(async data => {
        try {
            await saveLeave(data as LeaveCreateRequest & LeaveUpdateRequest);
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
                    toast.error('This leave does not exist anymore');
                    setLeaveToEdit!(undefined);
                    handleModalClose();
                }
            });
        }
    }, [result.isError]);
    useEffect(() => {
        if (leaveToEdit) {
            handleOpenLeaveModal();
        }
    }, [leaveToEdit]);
    useEffect(() => {
        if (errors.startDate || errors.endDate) {
            clearErrors(['startDate', 'endDate']);
            result.reset();
        }
    }, [startDateWatcher, endDateWatcher]);
    useEffect(() => {
        if (result.isSuccess) {
            handleModalClose();
            setLeaveToEdit!(undefined);
            reset(initialValues);
            result.reset();
            toast.success(
                `Successfully ${leaveToEdit ? 'updated' : 'created'} leave`
            );
        }
    }, [result.isSuccess]);

    return {
        isOpen,
        errors,
        leaveToEdit,
        modalStyles,
        isProfileView,
        userIdWatcher,
        endDateWatcher,
        isLoggedAsAdmin,
        startDateWatcher,
        endDateFieldProps,
        startDateFieldProps,
        isConfirmedFieldProps,
        isLoading: result.isLoading,
        leaveToEditUserId: initialValues.userId,
        onSubmit,
        handleUserChange,
        handleChangeEndDate,
        handleOpenLeaveModal,
        handleCloseLeaveModal,
        handleChangeStartDate
    };
};

export default useCreateOrUpdateLeave;
