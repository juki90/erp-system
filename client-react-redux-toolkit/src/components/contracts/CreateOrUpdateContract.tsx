import React from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import { animated } from '@react-spring/web';
import UserPicker from 'components/UserPicker';
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import useCreateOrUpdateContract from 'hooks/contracts/useCreateOrUpdateContract';
import 'react-datepicker/dist/react-datepicker.min.css';

const CreateOrUpdateContract: React.FC = () => {
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
                                  <div className="relative mb-4 pb-4">
                                      <label className="block text-gray-800 mb-3">
                                          User
                                      </label>
                                      {isProfileView ? (
                                          <p className="mb-4 text-sm">
                                              Search user by name or email
                                          </p>
                                      ) : null}
                                      <UserPicker
                                          preselectedUserId={
                                              contractToEditUserId
                                          }
                                          setSelectedUser={handleUserChange}
                                      />
                                      {errors?.userId ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.userId
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          Start date
                                      </label>
                                      <DatePicker
                                          showYearDropdown
                                          showPopperArrow={false}
                                          popperPlacement="top-start"
                                          dateFormat="yyyy-MM-dd"
                                          selected={new Date(startDateWatcher)}
                                          portalId="root"
                                          customInput={
                                              <div className="flex items-center">
                                                  <input
                                                      readOnly
                                                      className="w-full py-1 px-2 rounded w-full border-2 border-gray-400 cursor-pointer"
                                                      {...startDateFieldProps}
                                                  />
                                                  <CalendarDaysIcon className="h-6 w-6 -ml-8 text-gray-600 pointer-events-none" />
                                              </div>
                                          }
                                          onChange={handleChangeStartDate}
                                      />
                                      {errors?.startDate ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.startDate
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          Duration
                                      </label>
                                      <select
                                          className="w-full relative py-1 px-2 rounded w-full border-2 border-gray-400 cursor-pointer appearance-none"
                                          {...durationFieldProps}
                                      >
                                          <option value={1}>1 Month</option>
                                          <option value={3}>3 Months</option>
                                          <option value={6}>6 Months</option>
                                          <option value={12}>12 Months</option>
                                      </select>
                                      <div className="flex items-center relative float-right -mt-[36px] p-[10px] cursor-pointer pointer-events-none">
                                          <span className="block h-[20px] w-[1px] mr-[8px] p-0 bg-gray-300 after:content-['\200b']" />
                                          <svg
                                              className="fill-gray-300"
                                              height="20"
                                              width="20"
                                              viewBox="0 0 20 20"
                                          >
                                              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                                          </svg>
                                      </div>
                                      {errors?.duration ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.duration
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-2">
                                          End date
                                      </label>
                                      <div className="flex items-center">
                                          <input
                                              readOnly
                                              className="w-full py-1 px-2 bg-gray-200 rounded w-full border-2 border-gray-400"
                                              value={endDate}
                                          />
                                      </div>
                                  </div>
                                  <div className="relative mb-4 pb-3">
                                      <label className="block text-gray-800 mb-3">
                                          Days off
                                      </label>
                                      <div className="flex items-center mb-4">
                                          <input
                                              {...daysOffFieldProps}
                                              id="20-daysoff-radio"
                                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 !border-transparent !outline-transparent cursor-pointer"
                                              type="radio"
                                              value={'20'}
                                              defaultChecked={
                                                  getValues('daysOff') === '20'
                                              }
                                          />
                                          <label
                                              htmlFor="20-daysoff-radio"
                                              className="ml-2 text-sm font-medium text-gray-900"
                                          >
                                              20 Days
                                          </label>
                                      </div>
                                      <div className="flex items-center">
                                          <input
                                              {...daysOffFieldProps}
                                              id="26-daysoff-radio"
                                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 !border-transparent !outline-transparent cursor-pointer"
                                              type="radio"
                                              value={'26'}
                                              defaultChecked={
                                                  getValues('daysOff') === '26'
                                              }
                                          />
                                          <label
                                              htmlFor="26-daysoff-radio"
                                              className="ml-2 text-sm font-medium text-gray-900"
                                          >
                                              26 Days
                                          </label>
                                      </div>
                                      {errors?.daysOff ? (
                                          <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                                              {
                                                  errors?.daysOff
                                                      ?.message as string
                                              }
                                          </small>
                                      ) : null}
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
