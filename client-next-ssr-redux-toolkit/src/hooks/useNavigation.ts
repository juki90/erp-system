import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useSpring } from '@react-spring/web';
import { useState, useRef, useEffect } from 'react';

import useOutsideClick from 'hooks/useOutsideClick';
import { isLoggedInAsAdmin, isLoggedInAsUser } from 'reducers/authSlice';

const useNavigation = () => {
    const { pathname } = useRouter();
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [styles, api] = useSpring(() => ({
        from: { transform: 'translateX(100%)', opacity: 0 },
        config: { duration: 250 }
    }));
    const navRef = useRef<HTMLElement | null>(null);
    const isLoggedAsAdminFromStore = useSelector(isLoggedInAsAdmin);
    const isLoggedAsUserFromStore = useSelector(isLoggedInAsUser);
    const [isLoggedAsUser, setIsLoggedAsUser] = useState<boolean | null>(null);
    const [isLoggedAsAdmin, setIsLoggedAsAdmin] = useState<boolean | null>(
        null
    );

    const handleNavClick = () => {
        setIsOpening(!isOpening);

        if (isOpen && isOpening) {
            api.start({
                to: async animate => {
                    await animate({
                        to: { transform: 'translateX(100%)', opacity: 0 }
                    });

                    setIsOpen(false);
                }
            });

            return;
        }

        if (!isOpening) {
            setIsOpen(true);

            api.start({
                to: async animate => {
                    await animate({
                        to: { transform: 'translateX(0%)', opacity: 0.5 }
                    });
                }
            });
        }
    };

    const handleNavClose = () => {
        api.start({
            to: async animate => {
                await animate({
                    to: { transform: 'translateX(100%)', opacity: 0 }
                });

                setIsOpen(false);
                setIsOpening(false);
            }
        });
    };

    useEffect(() => {
        setIsLoggedAsAdmin(isLoggedAsAdminFromStore);
        setIsLoggedAsUser(isLoggedAsUserFromStore);
    }, []);

    useOutsideClick(navRef, handleNavClose);

    return {
        isOpen,
        styles,
        navRef,
        pathname,
        isLoggedAsUser,
        isLoggedAsAdmin,
        handleNavClick,
        handleNavClose
    };
};

export default useNavigation;
