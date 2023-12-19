import type { LoggedUser } from 'types/api/auth';

type AuthState = {
    loggedUser: LoggedUser | null;
    authCookie: string | undefined;
    isLoggedInAsAdmin: boolean | undefined;
    isLoggedInAsUser: boolean | undefined;
};

export type { AuthState };
