import { createContext } from 'react';

import type { Contract } from 'types';

const ContractContext = createContext<{
    isLoggedAsAdmin: undefined | boolean;
    contractToEdit: undefined | Contract;
    contractToDelete: undefined | Contract;
    setContractToEdit: ((contract: Contract | undefined) => void) | undefined;
    setContractToDelete: ((contract: Contract | undefined) => void) | undefined;
}>({
    isLoggedAsAdmin: undefined,
    setContractToEdit: undefined,
    contractToEdit: undefined,
    setContractToDelete: undefined,
    contractToDelete: undefined
});

export default ContractContext;
