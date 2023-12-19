import { useMemo } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import isSsr from 'helpers/isSsr';
import { authApi } from 'api/auth';
import { usersApi } from 'api/users';
import { leavesApi } from 'api/leaves';
import { contractsApi } from 'api/contracts';
import authReducer from 'reducers/authSlice';

const initialState = {};

let store: Store | undefined;

const makeStore = (preloadedState = initialState) =>
    configureStore({
        reducer: {
            [authApi.reducerPath]: authApi.reducer,
            auth: authReducer,
            [usersApi.reducerPath]: usersApi.reducer,
            [leavesApi.reducerPath]: leavesApi.reducer,
            [contractsApi.reducerPath]: contractsApi.reducer
        },
        preloadedState,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat([
                authApi.middleware,
                usersApi.middleware,
                leavesApi.middleware,
                contractsApi.middleware
            ])
    });

export const initializeStore = (preloadedState?: RootState) => {
    let _store = store ?? makeStore(preloadedState);

    if (preloadedState && store) {
        _store = makeStore({
            ...(store as Store).getState(),
            ...preloadedState
        });

        store = undefined;
    }

    if (isSsr) {
        return _store;
    }

    if (!store) {
        store = _store;
    }

    return _store;
};

export const removeUndefined = <T>(
    state: RootState | unknown
): RootState | unknown => {
    if (typeof state === 'undefined') {
        return null;
    }

    if (Array.isArray(state)) {
        return state.map(removeUndefined);
    }

    if (typeof state === 'object' && state !== null) {
        return Object.entries(state).reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key]: removeUndefined(value)
            }),
            {}
        );
    }

    return state;
};

export const useStore = (preloadedState = initialState) => {
    if ((preloadedState as Partial<RootState>)?.auth) {
        delete (preloadedState as Partial<RootState>).auth;
    }

    const store = useMemo(
        () => initializeStore(preloadedState as RootState),
        [preloadedState]
    );

    setupListeners(store.dispatch);

    return store;
};

export type Store = ReturnType<typeof makeStore>;
export type RootState = ReturnType<Store['getState']>;
