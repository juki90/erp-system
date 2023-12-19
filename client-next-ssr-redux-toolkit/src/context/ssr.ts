import { createContext } from 'react';

const SsrContext = createContext<{
    fetchErrors: {
        isUsersFetchFailed: boolean;
        isContractsFetchFailed: boolean;
        isLeavesFetchFailed: boolean;
        isMeFetchFailed: boolean;
        isTokenFetchFailed: boolean;
        isUserContractsFetchFailed: boolean;
        isUserLeavesFetchFailed: boolean;
        isUnauthorized: boolean;
    };
}>({
    fetchErrors: {
        isUsersFetchFailed: false,
        isContractsFetchFailed: false,
        isLeavesFetchFailed: false,
        isTokenFetchFailed: false,
        isUserContractsFetchFailed: false,
        isUserLeavesFetchFailed: false,
        isMeFetchFailed: false,
        isUnauthorized: false
    }
});

export default SsrContext;
