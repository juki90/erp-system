import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileContext from 'context/profile';
import PageHeading from 'components/PageHeading';
import ProfileBoard from 'components/ProfileBoard';
import LeaveList from 'components/leaves/LeaveList';
import ContractList from 'components/contracts/ContractList';

const ProfilePage: React.FC = () => {
    const { id: userId } = useParams();

    return (
        <div>
            <ProfileContext.Provider
                value={{ isProfileView: true, profileUserId: userId }}
            >
                <PageHeading>User Profile</PageHeading>
                <ProfileBoard />
                <hr className="mx-2 my-4" />
                <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                    My contracts
                </h2>
                <p className="mb-4">List of contracts</p>
                <ContractList />
                <hr className="mx-2 my-4" />
                <h2 className="font-bold text-lg md:text-xl xl:text-2xl mb-3">
                    My leaves
                </h2>
                <p className="mb-4">List of leaves</p>
                <LeaveList />
            </ProfileContext.Provider>
        </div>
    );
};

export default ProfilePage;
