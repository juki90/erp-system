import { createPortal } from 'react-dom';
import { animated } from '@react-spring/web';
import { XMarkIcon } from '@heroicons/react/24/solid';

import FormInput from 'components/FormInput';
import FormCheckbox from 'components/FormCheckbox';
import FormDatePicker from 'components/FormDatePicker';
import useCreateOrUpdateUser from 'hooks/users/useCreateOrUpdateUser';

import type { FC } from 'react';
import type { UserCreateRequest } from 'types';
import type { FieldErrors } from 'react-hook-form';

const CreateOrUpdateUser: FC = () => {
    const {
        isOpen,
        errors,
        isLoading,
        userToEdit,
        modalStyles,
        emailFieldProps,
        lastNameFieldProps,
        passwordFieldProps,
        birthDateFieldProps,
        firstNameFieldProps,
        formBirthDateWatcher,
        adminRightsFieldProps,
        onSubmit,
        handleOpenUserModal,
        handleCloseUserModal,
        handleChangeBirthDate
    } = useCreateOrUpdateUser();

    return (
        <div>
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 mb-4 rounded cursor-pointer disabled:bg-gray-400"
                onClick={handleOpenUserModal}
            >
                Create
            </button>
            {isOpen
                ? createPortal(
                      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full z-[150]">
                          <animated.div
                              style={{ transform: modalStyles.transform }}
                              className="rounded w-full mt-6 h-[90vh] sm:h-[80vh] md:h-[auto] sm:w-[400px] lg:w-[500px] z-[250] bg-gray-200 mx-2 p-8 overflow-y-scroll"
                          >
                              <div className="flex items-center text-gray-300 text-xl md:text-2xl xl:text-4xl mb-4 [text-shadow:_1px_1px_1px_rgb(255_255_255_/_100%)]">
                                  <h2 className="text-gray-800 text-2xl">
                                      {userToEdit ? 'Update' : 'Create'} user
                                  </h2>
                                  <button
                                      className="bg-gray-600 hover:bg-gray-800 rounded ml-auto"
                                      onClick={e =>
                                          !isLoading && handleCloseUserModal(e)
                                      }
                                  >
                                      <XMarkIcon className="h-6 w-6 text-gray-200" />
                                  </button>
                              </div>
                              <form>
                                  <FormInput
                                      htmlFor="firstName"
                                      label="First name"
                                      fieldProps={firstNameFieldProps}
                                      errorField={errors?.firstName}
                                  />
                                  <FormInput
                                      htmlFor="lastName"
                                      label="Last name"
                                      fieldProps={lastNameFieldProps}
                                      errorField={errors?.lastName}
                                  />
                                  <FormInput
                                      htmlFor="email"
                                      label="Email"
                                      fieldProps={emailFieldProps}
                                      errorField={errors?.email}
                                  />
                                  <FormDatePicker
                                      htmlFor="birthDate"
                                      label="Date of birth"
                                      fieldProps={birthDateFieldProps}
                                      errorField={errors?.birthDate}
                                      dateWatcher={formBirthDateWatcher}
                                      handleChangeDate={handleChangeBirthDate}
                                  />
                                  {userToEdit ? null : (
                                      <FormInput
                                          htmlFor="password"
                                          label="Password"
                                          type="password"
                                          fieldProps={passwordFieldProps!}
                                          errorField={
                                              (
                                                  errors as FieldErrors<UserCreateRequest>
                                              )?.password
                                          }
                                      />
                                  )}
                                  <FormCheckbox
                                      htmlFor="adminRights"
                                      label="Role"
                                      description="Assign admin role"
                                      fieldProps={adminRightsFieldProps}
                                  />
                                  <div className="pt-7 mb-4">
                                      <div className="flex items-center">
                                          <button
                                              className="bg-gray-600 hover:bg-gray-800 text-gray-200 px-4 py-2 mb-2 rounded cursor-pointer"
                                              type="submit"
                                              disabled={isLoading}
                                              onClick={data =>
                                                  !isLoading && onSubmit(data)
                                              }
                                          >
                                              {userToEdit ? 'Update' : 'Create'}
                                          </button>
                                          <button
                                              className="bg-gray-600 hover:bg-gray-800 text-gray-200 px-4 py-2 mb-2 ml-4 rounded cursor-pointer"
                                              type="submit"
                                              disabled={isLoading}
                                              onClick={e =>
                                                  !isLoading &&
                                                  handleCloseUserModal(e)
                                              }
                                          >
                                              Close
                                          </button>
                                          {isLoading ? (
                                              <div className="inline-block mx-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                          ) : null}
                                      </div>
                                  </div>
                              </form>
                          </animated.div>
                          <animated.div
                              style={{ opacity: modalStyles.opacity }}
                              className="fixed top-0 left-0 w-full h-full z-[200] bg-gray-900"
                          />
                      </div>,
                      document.body
                  )
                : null}
        </div>
    );
};

export default CreateOrUpdateUser;
