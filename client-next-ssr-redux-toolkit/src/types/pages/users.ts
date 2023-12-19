import type { RootState } from 'store';

interface GetServerSideUserProps {
    fetchErrors?: {
        isUsersFetchFailed?: boolean;
    };
    initialReduxState?: RootState;
}

interface GetServerSideUserProfileProps {
    fetchErrors?: {
        isUserFetchFailed?: boolean;
        isUserLeavesFetchFailed?: boolean;
        isUserContractsFetchFailed?: boolean;
    };
    initialReduxState?: RootState;
}

export type { GetServerSideUserProps, GetServerSideUserProfileProps };
