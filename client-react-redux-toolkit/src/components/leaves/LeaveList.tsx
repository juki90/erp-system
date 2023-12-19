import React, { useMemo } from 'react';
import { Table, Column } from 'react-virtualized';
import LeaveContext from 'context/leaves';
import useLeaves from 'hooks/leaves/useLeaves';
import ConfirmAction from 'components/ConfirmAction';
import LeaveListItem from 'components/leaves/LeaveListItem';
import CreateOrUpdateLeave from 'components/leaves/CreateOrUpdateLeave';

const LeaveList: React.FC = () => {
    const {
        leaves,
        isError,
        tableRef,
        isMobile,
        isSuccess,
        isLoading,
        isFetching,
        leaveToEdit,
        leaveToDelete,
        isLoggedAsAdmin,
        dimensionsForElement: {
            width: tableWidth,
            height: tableHeight,
            rowHeight,
            headerHeight
        },
        setLeaveToEdit,
        setLeaveToDelete,
        handleDeleteLeave,
        handleConfirmLeave
    } = useLeaves();

    const columns = useMemo(() => {
        const columnsData = [
            { label: '#', dataKey: 'index', width: 0.05 },
            {
                label: 'Start date',
                dataKey: 'startDate'
            },
            {
                label: 'End date',
                dataKey: 'endDate'
            },
            {
                label: 'Granted',
                dataKey: 'isConfirmed',
                width: 0.1
            },
            {
                label: 'Created at',
                dataKey: 'createdAt'
            },
            {
                label: 'Updated at',
                dataKey: 'updatedAt'
            },
            { label: 'Actions', dataKey: 'actions', width: 0.183 }
        ];

        return columnsData.map(({ label, dataKey, width }, i) => (
            <Column
                width={tableWidth! * (width || 0.166)}
                label={label}
                dataKey={dataKey}
                key={`leave-list-column-${i}`}
            />
        ));
    }, [tableWidth]);

    return (
        <LeaveContext.Provider
            value={{
                isLoggedAsAdmin,
                leaveToEdit,
                leaveToDelete,
                setLeaveToEdit,
                setLeaveToDelete
            }}
        >
            <CreateOrUpdateLeave />
            <ConfirmAction
                open={!!leaveToDelete}
                title="Delete leave"
                question={`You are about to delete leave: ${
                    leaveToDelete
                        ? `From ${leaveToDelete.startDate} to ${leaveToDelete.endDate}`
                        : ''
                }. Please confirm before deleting`}
                onConfirm={handleDeleteLeave}
                onDiscard={() => setLeaveToDelete(undefined)}
            />
            <Table
                ref={tableRef}
                width={tableWidth!}
                height={tableHeight!}
                disableHeader={isMobile}
                className="bg-gray-200 !rounded-md overflow-hidden"
                headerHeight={headerHeight!}
                headerClassName="w-full !m-0 p-2 pt-4 bg-gray-500 text-gray-100 divide-x-4 divide-gray-100 max-xl:text-sm xl:text-base [text-shadow:_1px_1px_1px_rgb(0_0_0_/_50%)]"
                rowHeight={rowHeight!}
                rowCount={leaves.length}
                rowGetter={({ index }) => leaves[index]}
                rowRenderer={({ style, index, rowData: leave }) => (
                    <LeaveListItem
                        key={leave.id}
                        style={{
                            ...style,
                            height: `${rowHeight!}px`
                        }}
                        index={index}
                        leave={leave}
                        isLoggedAsAdmin={!!isLoggedAsAdmin}
                        handleConfirmLeave={handleConfirmLeave}
                    />
                )}
            >
                {columns}
            </Table>
            {isLoading || isFetching ? (
                <div className="text-[125%] py-5 w-[90px] mx-auto text-center text-bold">
                    <div className="h-[90px] w-[90px] mx-auto animate-spin rounded-full border-4 border-solid border-gray-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <small className="text-center text-gray-600">
                        Loading...
                    </small>
                </div>
            ) : null}
            {!leaves.length && isSuccess ? (
                <p className="text-[125%] my-4 text-center text-gray-600">
                    No leaves at this moment
                </p>
            ) : null}
            {isError ? (
                <p className="text-[125%] my-4 text-center text-red-800">
                    Error during fetching leaves, please check later
                </p>
            ) : null}
        </LeaveContext.Provider>
    );
};

export default LeaveList;
