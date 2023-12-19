import React from 'react';
import PageHeading from 'components/PageHeading';
import ContractList from 'components/contracts/ContractList';

const ContractsPage: React.FC = () => {
    return (
        <div>
            <PageHeading>Contracts</PageHeading>
            <div className="pb-2">
                <p className="mb-3">Virtualized list of all your contracts</p>
                <ContractList />
            </div>
        </div>
    );
};

export default ContractsPage;
