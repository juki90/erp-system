import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from 'api/auth';
import { usersApi } from 'api/users';
import { contractsApi } from 'api/contracts';
import { leavesApi } from 'api/leaves';
import authReducer from 'reducers/authSlice';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [contractsApi.reducerPath]: contractsApi.reducer,
        [leavesApi.reducerPath]: leavesApi.reducer
    },

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat([
            authApi.middleware,
            usersApi.middleware,
            contractsApi.middleware,
            leavesApi.middleware
        ])
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
