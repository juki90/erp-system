import { createContext } from 'react';

import type { User } from 'types';

const UserContext = createContext<{
    userToEdit: undefined | User;
    userToDelete: undefined | User;
    setUserToEdit: ((user: User | undefined) => void) | undefined;
    setUserToDelete: ((user: User | undefined) => void) | undefined;
}>({
    setUserToEdit: undefined,
    userToEdit: undefined,
    setUserToDelete: undefined,
    userToDelete: undefined
});

export default UserContext;
