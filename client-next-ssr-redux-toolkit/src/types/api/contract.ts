type Contract = {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    duration: number;
    daysOff: string | number;
    createdAt: string;
    updatedAt: string;
};

type ContractCreateRequest = {
    userId: string;
    startDate: string;
    endDate: string;
    duration: number;
    daysOff: string | number;
};

type ContractUpdateRequest = {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    duration: number;
    daysOff: string | number;
};

type ContractCreateResponse = Contract;

type ContractUpdateResponse = Contract;

export type {
    Contract,
    ContractCreateRequest,
    ContractUpdateRequest,
    ContractCreateResponse,
    ContractUpdateResponse
};
