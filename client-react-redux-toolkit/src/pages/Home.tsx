import React from 'react';
import useHome from 'hooks/useHome';
import PageHeading from 'components/PageHeading';

const HomePage: React.FC = () => {
    const { loggedUser, isLoggedAsAdmin } = useHome();

    return (
        <div>
            <PageHeading>Welcome</PageHeading>
            <p className="mb-2">
                You are logged in as: <b>{loggedUser?.fullName}</b>. Your role
                is: <b>{isLoggedAsAdmin ? 'Admin' : 'User'}</b>
            </p>
        </div>
    );
};

export default HomePage;
