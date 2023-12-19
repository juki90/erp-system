import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getLoggedUser, isLoggedInAsAdmin } from 'reducers/authSlice';

import type { LoggedUser } from 'types';

const useHome = () => {
    const loggedUserFromStore = useSelector(getLoggedUser);
    const isLoggedAsAdminFromStore = useSelector(isLoggedInAsAdmin);

    const [loggedUser, setLoggedUser] = useState<
        LoggedUser | undefined | null
    >();
    const [isLoggedAsAdmin, setIsLoggedAsAdmin] = useState<
        boolean | null | unknown
    >();

    useEffect(() => {
        setLoggedUser(loggedUserFromStore);
        setIsLoggedAsAdmin(isLoggedAsAdminFromStore);
    });

    return {
        loggedUser,
        isLoggedAsAdmin
    };
};

export default useHome;
