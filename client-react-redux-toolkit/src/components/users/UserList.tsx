import React, { useMemo } from 'react';
import { Table, Column } from 'react-virtualized';
import UserContext from 'context/users';
import useUsers from 'hooks/users/useUsers';
import ConfirmAction from 'components/ConfirmAction';
import UserListItem from 'components/users/UserListItem';
import CreateOrUpdateUser from 'components/users/CreateOrUpdateUser';

const UserList: React.FC = () => {
    const {
        users,
        isError,
        tableRef,
        isMobile,
        isSuccess,
        isLoading,
        userToEdit,
        isFetching,
        userToDelete,
        dimensionsForElement: {
            width: tableWidth,
            height: tableHeight,
            rowHeight,
            headerHeight
        },
        setUserToEdit,
        setUserToDelete,
        handleDeleteUser
    } = useUsers();

    const columns = useMemo(() => {
        const columnsData = [
            { label: '#', dataKey: 'index', width: 0.066 },
            {
                label: 'First name',
                dataKey: 'firstName',
                width: 0.116
            },
            {
                label: 'Last name',
                dataKey: 'lastName',
                width: 0.116
            },
            { label: 'Email', dataKey: 'email', width: 0.18 },
            { label: 'Birth date', dataKey: 'birthDate' },
            { label: 'Leaves', dataKey: 'numberOfLeaveDays' },
            { label: 'Created at', dataKey: 'createdAt' },
            { label: 'Updated at', dataKey: 'updatedAt' },
            { label: 'Actions', dataKey: 'actions', width: 0.122 }
        ];

        return columnsData.map(({ label, dataKey, width }, i) => (
            <Column
                width={tableWidth! * (width || 0.1)}
                label={label}
                dataKey={dataKey}
                key={`user-list-column-${i}`}
            />
        ));
    }, [tableWidth]);

    return (
        <UserContext.Provider
            value={{ userToEdit, userToDelete, setUserToEdit, setUserToDelete }}
        >
            <CreateOrUpdateUser />
            <ConfirmAction
                open={!!userToDelete}
                title="Delete user"
                question={`You are about to delete user: ${
                    userToDelete ? userToDelete.fullName : ''
                }. Are you sure? Please confirm before deleting`}
                onConfirm={handleDeleteUser}
                onDiscard={() => setUserToDelete(undefined)}
            />
            <Table
                ref={tableRef}
                width={tableWidth!}
                height={users.length ? tableHeight! : 0}
                disableHeader={isMobile}
                className="bg-gray-200 !rounded-md overflow-hidden"
                headerHeight={headerHeight!}
                headerClassName="w-full !m-0 p-2 pt-4 bg-gray-500 text-gray-100 divide-x-4 divide-gray-100 max-xl:text-sm xl:text-base [text-shadow:_1px_1px_1px_rgb(0_0_0_/_50%)]"
                rowHeight={rowHeight!}
                rowCount={users.length}
                rowGetter={({ index }) => users[index]}
                rowRenderer={({ style, index, rowData: user }) => (
                    <UserListItem
                        key={user.id}
                        style={{
                            ...style,
                            height: `${rowHeight!}px`
                        }}
                        index={index}
                        user={user}
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
            {!users.length && isSuccess ? (
                <p className="text-[125%] my-4 text-center text-gray-600">
                    No users in the system at the moment
                </p>
            ) : null}
            {isError ? (
                <p className="text-[125%] my-4 text-center text-red-800">
                    Error during fetching users, please check later
                </p>
            ) : null}
        </UserContext.Provider>
    );
};

export default UserList;
