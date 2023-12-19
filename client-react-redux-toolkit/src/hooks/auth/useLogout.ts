import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { routes } from 'router';
import { useLogoutMutation } from 'api/auth';
import { clearLoggedUser } from 'reducers/authSlice';

const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            navigate(routes.login);
            toast.success('Successfully logged out');
        }
    }, [result.isSuccess]);

    return {
        handleLogout
    };
};

export default useLogout;
