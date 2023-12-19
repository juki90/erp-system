import dayjs from 'dayjs';
import PropTypes, { type Validator } from 'prop-types';
import { useContext, type FC, type CSSProperties } from 'react';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import {
    CheckCircleIcon,
    PencilSquareIcon,
    XCircleIcon
} from '@heroicons/react/24/solid';

import LeaveContext from 'context/leaves';
import { DATE_FORMAT } from 'config/constants';

import type { ILeaveListItem } from 'types';

const LeaveListItem: FC<ILeaveListItem> = ({
    index,
    leave,
    isLoggedAsAdmin,
    leave: { startDate, endDate, isConfirmed, createdAt, updatedAt },
    handleConfirmLeave,
    ...rest
}) => {
    const { setLeaveToEdit, setLeaveToDelete } = useContext(LeaveContext);

    return (
        <div
            className="!w-full lg:flex h-full !pr-0 lg:!pr-3 border-b border-gray-400 max-xl:text-sm xl:text-base text-left"
            {...rest}
        >
            <div className="max-lg:flex w-full lg:w-[5%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400 max-lg:bg-gray-500 max-lg:text-gray-200 max-lg:font-bold">
                <span className="lg:hidden">#</span>
                <span>{index + 1}</span>
            </div>
            <div className="max-lg:flex w-full lg:w-[16.6%] h-[calc(100% / 8)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Start date</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {startDate}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[16.6%] h-[calc(100% / 8)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">End date</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {endDate}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] h-[calc(100% / 8)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Granted</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {isConfirmed ? (
                        <CheckCircleIcon className="inline-block h-4 mr-0 xl:h-6 w-4 xl:w-6 mr-2 text-md text-green-700" />
                    ) : (
                        <EllipsisHorizontalCircleIcon className="inline-block h-4 mr-0 xl:h-6 w-4 xl:w-6 mr-2 text-md text-gray-400" />
                    )}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[16.6%] h-[calc(100% / 8)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Created at</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {dayjs(createdAt).format(DATE_FORMAT)}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[16.6%] h-[calc(100% / 8)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Updated at</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {dayjs(updatedAt).format(DATE_FORMAT)}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[18.3%] h-[calc(100% / 8)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Actions</span>
                <div>
                    {isLoggedAsAdmin && !isConfirmed ? (
                        <CheckCircleIcon
                            className="inline-block h-4 xl:h-6 w-4 xl:w-6 mr-2 text-md text-green-700 hover:text-green-500 cursor-pointer"
                            onClick={() => handleConfirmLeave!(leave.id)}
                        />
                    ) : !isLoggedAsAdmin ? null : (
                        <CheckCircleIcon className="inline-block h-4 xl:h-6 w-4 xl:w-6 mr-2 text-md text-gray-300" />
                    )}
                    {isLoggedAsAdmin || (!isLoggedAsAdmin && !isConfirmed) ? (
                        <>
                            <PencilSquareIcon
                                className="inline-block h-4 xl:h-6 w-4 xl:w-6 mr-2 text-md text-sky-800 hover:text-sky-600 cursor-pointer"
                                onClick={() => setLeaveToEdit!(leave)}
                            />

                            <XCircleIcon
                                className="inline-block h-4 xl:h-6 w-4 xl:w-6 text-md text-red-900 hover:text-red-600 cursor-pointer"
                                onClick={() => setLeaveToDelete!(leave)}
                            />
                        </>
                    ) : null}
                    {!isLoggedAsAdmin && isConfirmed ? '-' : null}
                </div>
            </div>
        </div>
    );
};

LeaveListItem.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired as Validator<CSSProperties>,
    isLoggedAsAdmin: PropTypes.bool.isRequired,
    leave: PropTypes.shape({
        id: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        isConfirmed: PropTypes.bool.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
    }).isRequired,
    handleConfirmLeave: PropTypes.func.isRequired
};

export default LeaveListItem;
