import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import isSsr from 'helpers/isSsr';
import { ROLES } from 'config/constants';

import type { RootState } from 'store';
import type { LoginResponse, AuthState, Role, LoggedUser } from 'types';

const slice = createSlice({
    name: 'auth',

    initialState: () => {
        const loggedUser = isSsr
            ? null
            : JSON.parse(localStorage.getItem('loggedUser') || 'null');

        return {
            loggedUser,
            authCookie: undefined,
            isLoggedInAsAdmin: loggedUser?.roles.includes(ROLES.ADMIN),
            isLoggedInAsUser: loggedUser?.roles.includes(ROLES.USER)
        } as AuthState;
    },

    reducers: {
        setLoggedUser: (
            state: AuthState,
            { payload }: PayloadAction<LoginResponse>
        ) => {
            const loggedUser = { ...(payload as LoggedUser) };

            loggedUser.roles = loggedUser.roles.map(
                role => (role as Role).name
            );

            if (!isSsr) {
                localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            }

            state.isLoggedInAsAdmin = loggedUser?.roles.includes(ROLES.ADMIN);
            state.isLoggedInAsUser = loggedUser?.roles.includes(ROLES.USER);
            state.loggedUser = loggedUser;
        },

        setAuthCookie: (
            state: AuthState,
            { payload }: PayloadAction<string>
        ) => {
            state.authCookie = payload;
        },

        clearLoggedUser: state => {
            if (!isSsr) {
                localStorage.removeItem('loggedUser');
            }

            state.loggedUser = null;
            state.authCookie = undefined;
            state.isLoggedInAsAdmin = undefined;
            state.isLoggedInAsUser = undefined;
        }
    }
});

export const { setLoggedUser, clearLoggedUser, setAuthCookie } = slice.actions;
export const getLoggedUser = (state: RootState) => state.auth.loggedUser;
export const getAuthCookie = (state: RootState) => state.auth.authCookie;
export const isLoggedInAsAdmin = (state: RootState) =>
    state.auth.isLoggedInAsAdmin;
export const isLoggedInAsUser = (state: RootState) =>
    state.auth.isLoggedInAsUser;

export default slice.reducer;
