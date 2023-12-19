import type { LoggedUser } from 'types';

type AuthState = {
    loggedUser: LoggedUser | null;
    isLoggedInAsAdmin: boolean | undefined;
    isLoggedInAsUser: boolean | undefined;
};

export type { AuthState };
