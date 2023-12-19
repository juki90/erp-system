import type { RootState } from 'store';

interface GetServerSideLeavesProps {
    fetchErrors?: {
        isLeavesFetchFailed?: boolean;
        isUsersFetchFailed?: boolean;
        isUnauthorized?: boolean;
    };
    initialReduxState?: RootState;
}

export type { GetServerSideLeavesProps };
