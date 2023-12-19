import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSpring } from '@react-spring/web';
import { useLocation } from 'react-router-dom';
import useOutsideClick from 'hooks/useOutsideClick';
import { isLoggedInAsAdmin, isLoggedInAsUser } from 'reducers/authSlice';

const useNavigation = () => {
    const { pathname } = useLocation();
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [styles, api] = useSpring(() => ({
        from: { transform: 'translateX(100%)', opacity: 0 },
        config: { duration: 250 }
    }));
    const navRef = useRef<HTMLElement | null>(null);
    const isLoggedAsAdmin = useSelector(isLoggedInAsAdmin);
    const isLoggedAsUser = useSelector(isLoggedInAsUser);

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
