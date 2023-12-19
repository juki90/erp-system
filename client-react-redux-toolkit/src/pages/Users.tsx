import React from 'react';
import UserList from 'components/users/UserList';
import PageHeading from 'components/PageHeading';

const UsersPage: React.FC = () => {
    return (
        <div>
            <PageHeading>Users</PageHeading>
            <div className="pb-2">
                <p className="mb-3">
                    Virtualized list of all users in the system
                </p>
                <UserList />
            </div>
        </div>
    );
};

export default UsersPage;
