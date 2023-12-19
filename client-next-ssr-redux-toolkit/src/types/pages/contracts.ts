import type { RootState } from 'store';

interface GetServerSideContractProps {
    fetchErrors?: {
        isContractsFetchFailed?: boolean;
        isUsersFetchFailed?: boolean;
    };
    initialReduxState?: RootState;
}

export type { GetServerSideContractProps };
