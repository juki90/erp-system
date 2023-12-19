import React from 'react';
import PageHeading from 'components/PageHeading';
import LeaveList from 'components/leaves/LeaveList';

const LeavesPage: React.FC = () => {
    return (
        <div>
            <PageHeading>Leaves</PageHeading>
            <div className="pb-2">
                <p className="mb-3">Virtualized list of all your leaves</p>
                <LeaveList />
            </div>
        </div>
    );
};

export default LeavesPage;
