import { useSelector } from 'react-redux';
import { getLoggedUser } from 'reducers/authSlice';

const useNotFound = () => {
    const loggedUser = useSelector(getLoggedUser);

    return {
        loggedUser
    };
};

export default useNotFound;
