import { createContext } from 'react';

const ProfileContext = createContext<{
    isProfileView: boolean;
    profileUserId: string | undefined;
}>({
    isProfileView: false,
    profileUserId: undefined
});

export default ProfileContext;
