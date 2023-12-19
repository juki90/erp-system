import { useSelector } from 'react-redux';
import { getLoggedUser, isLoggedInAsAdmin } from 'reducers/authSlice';

const useHome = () => {
    const loggedUser = useSelector(getLoggedUser);
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);

    return {
        loggedUser,
        isLoggedAsAdmin
    };
};

export default useHome;
