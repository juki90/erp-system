import type { RootState } from 'store';

interface GetServerSideProfileProps {
    fetchErrors?: {
        isMeFetchFailed?: boolean;
        isLeavesFetchFailed?: boolean;
        isContractsFetchFailed?: boolean;
    };
    initialReduxState?: RootState;
}

export type { GetServerSideProfileProps };
