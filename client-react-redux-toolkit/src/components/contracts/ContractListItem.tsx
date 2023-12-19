import dayjs from 'dayjs';
import PropTypes, { type Validator } from 'prop-types';
import React, { useContext, type CSSProperties } from 'react';
import { XCircleIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { DATE_FORMAT } from 'config/constants';
import type { IContractListItem } from 'types';
import ContractContext from 'context/contracts';

const ContractListItem: React.FC<IContractListItem> = ({
    index,
    contract,
    isLoggedAsAdmin,
    contract: { startDate, endDate, duration, daysOff, createdAt, updatedAt },
    ...rest
}) => {
    const { setContractToEdit, setContractToDelete } =
        useContext(ContractContext);

    return (
        <div
            className="!w-full lg:flex h-full !pr-0 lg:!pr-3 border-b border-gray-400 max-xl:text-sm xl:text-base text-left"
            {...rest}
        >
            <div className="max-lg:flex w-full lg:w-[6.6%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400 max-lg:bg-gray-500 max-lg:text-gray-200 max-lg:font-bold">
                <span className="lg:hidden">#</span>
                <span>{index + 1}</span>
            </div>
            <div className="max-lg:flex w-full lg:w-[16.6%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Start date</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {startDate}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[16.6%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">End date</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {endDate}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Duration</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {duration}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Days Off</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {daysOff}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[13.3%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Created at</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {dayjs(createdAt).format(DATE_FORMAT)}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[13.3%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Updated at</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {dayjs(updatedAt).format(DATE_FORMAT)}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[13.3%] h-[calc(100% / 8)] p-2  max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Actions</span>
                <div>
                    {isLoggedAsAdmin ? (
                        <>
                            <PencilSquareIcon
                                className="inline-block h-4 xl:h-6 w-4 xl:w-6 mr-2 text-md text-sky-800 hover:text-sky-600 cursor-pointer"
                                onClick={() => setContractToEdit!(contract)}
                            />
                            <XCircleIcon
                                className="inline-block h-4 xl:h-6 w-4 xl:w-6 text-md text-red-900 hover:text-red-600 cursor-pointer"
                                onClick={() => setContractToDelete!(contract)}
                            />
                        </>
                    ) : (
                        '-'
                    )}
                </div>
            </div>
        </div>
    );
};

ContractListItem.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired as Validator<CSSProperties>,
    isLoggedAsAdmin: PropTypes.bool,
    contract: PropTypes.shape({
        id: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        daysOff: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
    }).isRequired
};

export default ContractListItem;
