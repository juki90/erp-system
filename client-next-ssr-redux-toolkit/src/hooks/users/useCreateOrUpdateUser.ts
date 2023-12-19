import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useEffect, useContext, type MouseEventHandler } from 'react';
import { FieldValues, useForm, type UseFormSetError } from 'react-hook-form';

import useModal from 'hooks/useModal';
import UserContext from 'context/users';
import { DATE_FORMAT } from 'config/constants';
import errorConverter from 'helpers/errorConverter';
import { useStoreUserMutation, useUpdateUserMutation } from 'api/users';
import createOrUpdateUserValidation from 'validations/users/createOrUpdateUser';

import type { UserCreateRequest, UserUpdateRequest } from 'types';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

const useCreateOrUpdateUser = () => {
    const { userToEdit, setUserToEdit } = useContext(UserContext);
    const [saveUser, result] = userToEdit
        ? useUpdateUserMutation()
        : useStoreUserMutation();

    const initialValues = userToEdit
        ? {
              id: userToEdit.id,
              firstName: userToEdit.firstName,
              lastName: userToEdit.lastName,
              email: userToEdit.email,
              birthDate: userToEdit.birthDate,
              adminRights: false
          }
        : {
              firstName: '',
              lastName: '',
              email: '',
              birthDate: dayjs().subtract(18, 'y').format(DATE_FORMAT),
              password: '',
              adminRights: false
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
    } = useForm<UserCreateRequest | UserUpdateRequest>({
        defaultValues: initialValues,
        reValidateMode: 'onChange',
        mode: 'onSubmit'
    });

    const validation = userToEdit ? 'update' : 'create';
    const formEmailWatcher = watch('email');
    const formBirthDateWatcher = watch('birthDate');

    const firstNameFieldProps = register(
        'firstName',
        createOrUpdateUserValidation[validation].firstName
    );
    const lastNameFieldProps = register(
        'lastName',
        createOrUpdateUserValidation[validation].lastName
    );
    const emailFieldProps = register(
        'email',
        createOrUpdateUserValidation[validation].email
    );
    const birthDateFieldProps = register(
        'birthDate',
        createOrUpdateUserValidation[validation].birthDate
    );
    const adminRightsFieldProps = register('adminRights');
    const passwordFieldProps = userToEdit
        ? null
        : register('password', createOrUpdateUserValidation.create.password);

    const handleChangeBirthDate = (date: Date | null | undefined) => {
        setValue('birthDate', dayjs(date || undefined).format(DATE_FORMAT));
    };
    const handleOpenUserModal = () => {
        reset(initialValues);
        handleModalOpen();
    };
    const handleCloseUserModal: MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault();
        setUserToEdit!(undefined);
        handleModalClose();
    };
    const onSubmit = handleSubmit(async data => {
        try {
            await saveUser(data as UserCreateRequest & UserUpdateRequest);
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
                    toast.error('This user does not exist anymore');
                    setUserToEdit!(undefined);
                    handleModalClose();
                }
            });
        }
    }, [result.isError]);
    useEffect(() => {
        if (userToEdit) {
            handleOpenUserModal();
        }
    }, [userToEdit]);
    useEffect(() => {
        if (errors.email) {
            clearErrors('email');
            result.reset();
        }
    }, [formEmailWatcher]);
    useEffect(() => {
        if (result.isSuccess) {
            handleModalClose();
            setUserToEdit!(undefined);
            reset(initialValues);
            result.reset();
            toast.success(
                `Successfully ${userToEdit ? 'updated' : 'created'} user`
            );
        }
    }, [result.isSuccess]);

    return {
        isOpen,
        errors,
        isLoading: result.isLoading,
        userToEdit,
        modalStyles,
        emailFieldProps,
        lastNameFieldProps,
        passwordFieldProps,
        firstNameFieldProps,
        birthDateFieldProps,
        formBirthDateWatcher,
        adminRightsFieldProps,
        onSubmit,
        handleOpenUserModal,
        handleCloseUserModal,
        handleChangeBirthDate
    };
};

export default useCreateOrUpdateUser;
