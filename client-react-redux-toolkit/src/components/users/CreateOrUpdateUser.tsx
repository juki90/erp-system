import React from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import { animated } from '@react-spring/web';
import { FieldErrors } from 'react-hook-form';
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import type { UserCreateRequest } from 'types';
import useCreateOrUpdateUser from 'hooks/users/useCreateOrUpdateUser';
import 'react-datepicker/dist/react-datepicker.min.css';

const CreateOrUpdateUser: React.FC = () => {
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
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          First name
                                      </label>
                                      <input
                                          className="w-full py-1 px-2 rounded border-2 border-gray-400"
                                          {...firstNameFieldProps}
                                      />
                                      {errors?.firstName ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.firstName
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          Last name
                                      </label>
                                      <input
                                          className="w-full py-1 px-2 rounded border-2 border-gray-400"
                                          {...lastNameFieldProps}
                                      />
                                      {errors?.lastName ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.lastName
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          Email
                                      </label>
                                      <input
                                          className="w-full py-1 px-2 rounded border-2 border-gray-400"
                                          {...emailFieldProps}
                                      />
                                      {errors?.email ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {errors?.email?.message as string}
                                          </small>
                                      ) : null}
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          Birth date
                                      </label>
                                      <DatePicker
                                          showYearDropdown
                                          showPopperArrow={false}
                                          popperPlacement="top-start"
                                          dateFormat="yyyy-MM-dd"
                                          selected={
                                              new Date(formBirthDateWatcher)
                                          }
                                          portalId="root"
                                          customInput={
                                              <div className="flex items-center">
                                                  <input
                                                      readOnly
                                                      className="w-full py-1 px-2 rounded border-2 border-gray-400 cursor-pointer"
                                                      {...birthDateFieldProps}
                                                  />
                                                  <CalendarDaysIcon className="h-6 w-6 -ml-8 text-gray-600" />
                                              </div>
                                          }
                                          onChange={handleChangeBirthDate}
                                      />
                                      {errors?.birthDate ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.birthDate
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
                                  </div>
                                  {userToEdit ? null : (
                                      <div className="relative mb-8 pb-3">
                                          <label className="block text-md text-gray-800 mb-2 ">
                                              Password
                                          </label>
                                          <input
                                              className="w-full py-1 px-2 rounded border-2 border-gray-400"
                                              {...passwordFieldProps}
                                          />
                                          {(
                                              errors as FieldErrors<UserCreateRequest>
                                          )?.password ? (
                                              <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                                  {
                                                      (
                                                          errors as FieldErrors<UserCreateRequest>
                                                      )?.password
                                                          ?.message as string
                                                  }
                                              </small>
                                          ) : null}
                                      </div>
                                  )}
                                  <div className="mb-4 pb-3">
                                      <label className="block text-gray-800 mb-3">
                                          Role
                                      </label>
                                      <div className="flex items-center">
                                          <input
                                              type="checkbox"
                                              className="block !h-6 !w-6 mr-2 mx-0 rounded w-full border-2 border-gray-400"
                                              {...adminRightsFieldProps}
                                          />
                                          <span className="block min-w-[250px]">
                                              Assign admin role
                                          </span>
                                      </div>
                                  </div>
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
