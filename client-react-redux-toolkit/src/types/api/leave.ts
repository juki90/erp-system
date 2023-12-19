type Leave = {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
};

type LeaveCreateRequest = {
    userId: string;
    startDate: string;
    endDate: string;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
};

type LeaveUpdateRequest = {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
};

type LeaveCreateResponse = {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
};

type LeaveUpdateResponse = {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
};

export type {
    LeaveCreateRequest,
    LeaveUpdateRequest,
    LeaveCreateResponse,
    LeaveUpdateResponse,
    Leave
};
