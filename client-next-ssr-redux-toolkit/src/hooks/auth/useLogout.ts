import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { routes } from 'routes';
import { useLogoutMutation } from 'api/auth';
import { clearLoggedUser } from 'reducers/authSlice';

const useLogout = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [logout, result] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);

            toast.error('Error during executing request');
        }
    };

    useEffect(() => {
        if (result.isError) {
            toast.error('Error during logging out');

            result.reset();
        }
    }, [result.isError]);
    useEffect(() => {
        if (result.isSuccess) {
            dispatch(clearLoggedUser());
            router.push(routes.login);
            toast.success('Successfully logged out');
        }
    }, [result.isSuccess]);

    return {
        handleLogout
    };
};

export default useLogout;
