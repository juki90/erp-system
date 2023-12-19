import useHome from 'hooks/useHome';
import UserLayout from 'layout/UserLayout';

import type { NextPage } from 'next';

const HomePage: NextPage = () => {
    const { loggedUser, isLoggedAsAdmin } = useHome();

    return (
        <UserLayout>
            <p className="mb-2">
                You are logged in as: <b>{loggedUser?.fullName}</b>. Your role
                is: <b>{isLoggedAsAdmin ? 'Admin' : 'User'}</b>
            </p>
        </UserLayout>
    );
};

export default HomePage;
