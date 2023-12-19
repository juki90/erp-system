import { createPortal } from 'react-dom';
import { animated } from '@react-spring/web';
import { XMarkIcon } from '@heroicons/react/24/solid';

import FormInput from 'components/FormInput';
import FormRadio from 'components/FormRadio';
import FormSelect from 'components/FormSelect';
import UserPicker from 'components/UserPicker';
import FormDatePicker from 'components/FormDatePicker';
import useCreateOrUpdateContract from 'hooks/contracts/useCreateOrUpdateContract';

import type { FC } from 'react';

const CreateOrUpdateContract: FC = () => {
    const {
        isOpen,
        errors,
        endDate,
        isLoading,
        modalStyles,
        isProfileView,
        contractToEdit,
        startDateWatcher,
        daysOffFieldProps,
        durationFieldProps,
        startDateFieldProps,
        contractToEditUserId,
        onSubmit,
        getValues,
        handleUserChange,
        handleChangeStartDate,
        handleOpenContractModal,
        handleCloseContractModal
    } = useCreateOrUpdateContract();

    return (
        <div>
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 mb-4 rounded cursor-pointer disabled:bg-gray-400"
                onClick={handleOpenContractModal}
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
                                      {contractToEdit ? 'Update' : 'Create'}{' '}
                                      contract
                                  </h2>
                                  <button
                                      className="bg-gray-600 hover:bg-gray-800 rounded ml-auto"
                                      onClick={e =>
                                          !isLoading &&
                                          handleCloseContractModal(e)
                                      }
                                  >
                                      <XMarkIcon className="h-6 w-6 text-gray-200" />
                                  </button>
                              </div>
                              <form>
                                  <UserPicker
                                      label="User"
                                      htmlFor="userId"
                                      description={
                                          isProfileView
                                              ? 'Search user by name or email'
                                              : ''
                                      }
                                      isProfileView={isProfileView}
                                      errorField={errors?.userId}
                                      preselectedUserId={contractToEditUserId}
                                      setSelectedUser={handleUserChange}
                                  />
                                  <FormDatePicker
                                      label="Start date"
                                      htmlFor="startDate"
                                      dateWatcher={startDateWatcher}
                                      errorField={errors?.startDate}
                                      fieldProps={startDateFieldProps}
                                      handleChangeDate={handleChangeStartDate}
                                  />
                                  <FormSelect
                                      label="Duration"
                                      htmlFor="duration"
                                      options={[
                                          { value: 1, label: '1 Month' },
                                          { value: 3, label: '3 Months' },
                                          { value: 6, label: '6 Months' },
                                          { value: 12, label: '12 Months' }
                                      ]}
                                      errorField={errors?.duration}
                                      fieldProps={durationFieldProps}
                                  />
                                  <FormInput
                                      readOnly
                                      className="w-full py-1 px-2 bg-gray-200 rounded w-full border-2 border-gray-400"
                                      label="End date"
                                      htmlFor="endDate"
                                      value={endDate}
                                  />
                                  <FormRadio
                                      label="Days off"
                                      options={[
                                          { label: '20 Days', value: '20' },
                                          { label: '26 Days', value: '26' }
                                      ]}
                                      errorField={errors?.daysOff}
                                      fieldProps={daysOffFieldProps}
                                      getValue={() => getValues('daysOff')}
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
                                              {contractToEdit
                                                  ? 'Update'
                                                  : 'Create'}
                                          </button>
                                          <button
                                              className="bg-gray-600 hover:bg-gray-800 text-gray-200 px-4 py-2 mb-2 ml-4 rounded cursor-pointer"
                                              type="submit"
                                              disabled={isLoading}
                                              onClick={e =>
                                                  !isLoading &&
                                                  handleCloseContractModal(e)
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

export default CreateOrUpdateContract;
