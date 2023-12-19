import { createPortal } from 'react-dom';
import { animated } from '@react-spring/web';
import { XMarkIcon } from '@heroicons/react/24/solid';

import UserPicker from 'components/UserPicker';
import FormCheckbox from 'components/FormCheckbox';
import FormDatePicker from 'components/FormDatePicker';
import useCreateOrUpdateLeave from 'hooks/leaves/useCreateOrUpdateLeave';

import type { FC } from 'react';

const CreateOrUpdateLeave: FC = () => {
    const {
        isOpen,
        errors,
        isLoading,
        modalStyles,
        leaveToEdit,
        isProfileView,
        endDateWatcher,
        isLoggedAsAdmin,
        startDateWatcher,
        leaveToEditUserId,
        endDateFieldProps,
        startDateFieldProps,
        isConfirmedFieldProps,
        onSubmit,
        handleUserChange,
        handleChangeEndDate,
        handleOpenLeaveModal,
        handleCloseLeaveModal,
        handleChangeStartDate
    } = useCreateOrUpdateLeave();

    return (
        <div>
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 mb-4 rounded cursor-pointer disabled:bg-gray-400"
                onClick={handleOpenLeaveModal}
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
                                      {leaveToEdit ? 'Update' : 'Create'} leave
                                  </h2>
                                  <button
                                      className="bg-gray-600 hover:bg-gray-800 rounded ml-auto"
                                      onClick={e =>
                                          !isLoading && handleCloseLeaveModal(e)
                                      }
                                  >
                                      <XMarkIcon className="h-6 w-6 text-gray-200" />
                                  </button>
                              </div>
                              <form>
                                  {isLoggedAsAdmin ? (
                                      <UserPicker
                                          label="User"
                                          htmlFor="userId"
                                          description={
                                              isLoggedAsAdmin
                                                  ? 'Search user by name or email'
                                                  : ''
                                          }
                                          isProfileView={isProfileView}
                                          preselectedUserId={leaveToEditUserId}
                                          errorField={errors?.userId}
                                          setSelectedUser={handleUserChange}
                                      />
                                  ) : null}
                                  <FormDatePicker
                                      label="Start date"
                                      htmlFor="startDate"
                                      dateWatcher={startDateWatcher}
                                      errorField={errors?.startDate}
                                      fieldProps={startDateFieldProps}
                                      handleChangeDate={handleChangeStartDate}
                                  />
                                  <FormDatePicker
                                      label="End date"
                                      htmlFor="endDate"
                                      dateWatcher={endDateWatcher}
                                      errorField={errors?.endDate}
                                      fieldProps={endDateFieldProps}
                                      handleChangeDate={handleChangeEndDate}
                                  />
                                  {isLoggedAsAdmin ? (
                                      <FormCheckbox
                                          htmlFor="isConfirmed"
                                          label="Granted"
                                          description="Mark as granted"
                                          fieldProps={isConfirmedFieldProps}
                                      />
                                  ) : null}
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
                                              {leaveToEdit
                                                  ? 'Update'
                                                  : 'Create'}
                                          </button>
                                          <button
                                              className="bg-gray-600 hover:bg-gray-800 text-gray-200 px-4 py-2 mb-2 ml-4 rounded cursor-pointer"
                                              type="submit"
                                              disabled={isLoading}
                                              onClick={e =>
                                                  !isLoading &&
                                                  handleCloseLeaveModal(e)
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

export default CreateOrUpdateLeave;
