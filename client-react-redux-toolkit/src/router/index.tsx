import { redirect, createBrowserRouter } from 'react-router-dom';
import HomePage from 'pages/Home';
import Layout from 'layout/Layout';
import LoginPage from 'pages/Login';
import UsersPage from 'pages/Users';
import LeavesPage from 'pages/Leaves';
import ProfilePage from 'pages/Profile';
import { ROLES } from 'config/constants';
import NotFoundPage from 'pages/NotFound';
import ContractsPage from 'pages/Contracts';
import UserProfilePage from 'pages/UserProfile';
import PasswordResetPage from 'pages/PasswordReset';
import ForgotPasswordPage from 'pages/ForgotPassword';

const routePaths = {
    login: 'login',
    logout: 'logout',
    users: 'users',
    userProfile: 'users/:id',
    contracts: 'contracts',
    leaves: 'leaves',
    profile: 'profile',
    forgotPassword: 'forgot-password',
    passwordReset: 'forgot-password/:token'
};

const routes = {
    root: '/',
    login: `/${routePaths.login}`,
    logout: `/${routePaths.logout}`,
    users: `/${routePaths.users}`,
    userProfile: `/${routePaths.userProfile}`,
    contracts: `/${routePaths.contracts}`,
    leaves: `/${routePaths.leaves}`,
    profile: `/${routePaths.profile}`,
    forgotPassword: `/${routePaths.forgotPassword}`,
    passwordReset: `/${routePaths.passwordReset}`
};

const loadOrRedirect = (role: string) => () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');

    if (role === 'guest') {
        if (loggedUser) {
            return redirect(routes.root);
        }

        return null;
    }

    if (role === 'authenticated' && loggedUser) {
        return null;
    }

    if (loggedUser && !loggedUser.roles.includes(role)) {
        return redirect(routes.root);
    }

    if (!loggedUser) {
        return redirect(routes.login);
    }

    return null;
};

const router = createBrowserRouter([
    {
        path: routes.login,
        element: <LoginPage />,
        loader: loadOrRedirect('guest')
    },
    {
        path: routes.root,
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
                loader: loadOrRedirect('authenticated')
            }
        ]
    },
    {
        path: routes.users,
        element: <Layout />,
        children: [
            {
                index: true,
                element: <UsersPage />,
                loader: loadOrRedirect(ROLES.ADMIN)
            },
            {
                path: routes.userProfile,
                element: <UserProfilePage />,
                loader: loadOrRedirect(ROLES.ADMIN)
            }
        ]
    },
    {
        path: routes.contracts,
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ContractsPage />,
                loader: loadOrRedirect(ROLES.ADMIN)
            }
        ]
    },
    {
        path: routes.leaves,
        element: <Layout />,
        children: [
            {
                index: true,
                element: <LeavesPage />,
                loader: loadOrRedirect(ROLES.ADMIN)
            }
        ]
    },
    {
        path: routes.profile,
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProfilePage />,
                loader: loadOrRedirect('authenticated')
            }
        ]
    },
    {
        path: routes.forgotPassword,
        element: <ForgotPasswordPage />,
        loader: loadOrRedirect('guest')
    },
    {
        path: routes.passwordReset,
        element: <PasswordResetPage />,
        loader: loadOrRedirect('guest')
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
]);

export { router, routes, routePaths };
