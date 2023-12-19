import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { routes } from 'routes';
import isSsr from 'helpers/isSsr';
import { ROLES } from 'config/constants';
import { isLoggedInAsAdmin, isLoggedInAsUser } from 'reducers/authSlice';

const useProtectedRoute = () => {
    if (isSsr) {
        return;
    }

    const protectedRoutesConfig = {
        [ROLES.GUEST]: [
            routes.login,
            routes.forgotPassword,
            routes.passwordReset
        ],
        [ROLES.USER]: [routes.root, routes.profile],
        [ROLES.ADMIN]: [
            routes.users,
            routes.contracts,
            routes.leaves,
            routes.userProfile
        ]
    };
    const router = useRouter();
    const isAdmin = useSelector(isLoggedInAsAdmin);
    const isUser = useSelector(isLoggedInAsUser);
    const { pathname } = router;

    if (
        !isUser &&
        !isAdmin &&
        !protectedRoutesConfig[ROLES.GUEST].includes(pathname)
    ) {
        return router.push(routes.login);
    }

    if (isUser && !protectedRoutesConfig[ROLES.USER].includes(pathname)) {
        return router.push(routes.root);
    }

    if (
        isAdmin &&
        ![
            ...protectedRoutesConfig[ROLES.ADMIN],
            ...protectedRoutesConfig[ROLES.USER]
        ].includes(pathname)
    ) {
        return router.push(routes.root);
    }
};

export default useProtectedRoute;
