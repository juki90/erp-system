import React, { useMemo } from 'react';
import { Table, Column } from 'react-virtualized';
import ContractContext from 'context/contracts';
import ConfirmAction from 'components/ConfirmAction';
import useContracts from 'hooks/contracts/useContracts';
import ContractListItem from 'components/contracts/ContractListItem';
import CreateOrUpdateContract from 'components/contracts/CreateOrUpdateContract';

const ContractList: React.FC = () => {
    const {
        isError,
        tableRef,
        isMobile,
        contracts,
        isSuccess,
        isLoading,
        isFetching,
        contractToEdit,
        isLoggedAsAdmin,
        contractToDelete,
        dimensionsForElement: {
            width: tableWidth,
            height: tableHeight,
            rowHeight,
            headerHeight
        },
        setContractToEdit,
        setContractToDelete,
        handleDeleteContract
    } = useContracts();

    const columns = useMemo(() => {
        const columnsData = [
            { label: '#', dataKey: 'index', width: 0.066 },
            {
                label: 'Start date',
                dataKey: 'startDate',
                width: 0.166
            },
            {
                label: 'End date',
                dataKey: 'endDate',
                width: 0.166
            },
            { label: 'Duration', dataKey: 'duration' },
            { label: 'Days off', dataKey: 'daysOff' },
            {
                label: 'Created at',
                dataKey: 'createdAt',
                width: 0.133
            },
            {
                label: 'Updated at',
                dataKey: 'updatedAt',
                width: 0.133
            },
            { label: 'Actions', dataKey: 'actions', width: 0.133 }
        ];

        return columnsData.map(({ label, dataKey, width }, i) => (
            <Column
                width={tableWidth! * (width || 0.1)}
                label={label}
                dataKey={dataKey}
                key={`contract-list-column-${i}`}
            />
        ));
    }, [tableWidth]);

    return (
        <ContractContext.Provider
            value={{
                isLoggedAsAdmin,
                contractToEdit,
                contractToDelete,
                setContractToEdit,
                setContractToDelete
            }}
        >
            {isLoggedAsAdmin ? <CreateOrUpdateContract /> : null}
            <ConfirmAction
                open={!!contractToDelete}
                title="Delete contract"
                question={`You are about to delete contract: ${
                    contractToDelete
                        ? `From ${contractToDelete.startDate} with duration of ${contractToDelete.duration} months`
                        : ''
                }. Please confirm before deleting`}
                onConfirm={handleDeleteContract}
                onDiscard={() => setContractToDelete(undefined)}
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
                rowCount={contracts.length}
                rowGetter={({ index }) => contracts[index]}
                rowRenderer={({ style, index, rowData: contract }) => (
                    <ContractListItem
                        key={contract.id}
                        style={{
                            ...style,
                            height: `${rowHeight!}px`
                        }}
                        index={index}
                        contract={contract}
                        isLoggedAsAdmin={isLoggedAsAdmin}
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
            {!contracts.length && isSuccess ? (
                <p className="text-[125%] my-4 text-center text-gray-600">
                    No contracts at this moment
                </p>
            ) : null}
            {isError ? (
                <p className="text-[125%] my-4 text-center text-red-800">
                    Error during fetching contracts, please check later
                </p>
            ) : null}
        </ContractContext.Provider>
    );
};

export default ContractList;
