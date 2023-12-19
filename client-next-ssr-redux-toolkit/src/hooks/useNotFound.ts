'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getLoggedUser } from 'reducers/authSlice';

import type { LoggedUser } from 'types';

const useNotFound = () => {
    const loggedUserFromStore = useSelector(getLoggedUser);

    const [loggedUser, setLoggedUser] = useState<
        LoggedUser | undefined | null
    >();

    useEffect(() => {
        setLoggedUser(loggedUserFromStore);
    });

    return {
        loggedUser
    };
};

export default useNotFound;
