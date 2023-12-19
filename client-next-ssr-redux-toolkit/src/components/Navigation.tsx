import Link from 'next/link';
import { useMemo, type FC } from 'react';
import { createPortal } from 'react-dom';
import { animated } from '@react-spring/web';
import {
    HomeIcon,
    Bars3Icon,
    UsersIcon,
    ClipboardDocumentIcon,
    DocumentDuplicateIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon
} from '@heroicons/react/24/solid';

import { routes } from 'routes';
import useLogout from 'hooks/auth/useLogout';
import useNavigation from 'hooks/useNavigation';

const Navigation: FC = () => {
    const { handleLogout } = useLogout();
    const {
        isOpen,
        styles,
        navRef,
        pathname,
        isLoggedAsUser,
        isLoggedAsAdmin,
        handleNavClick,
        handleNavClose
    } = useNavigation();

    const navListLinks = useMemo(() => {
        const links: {
            to: string;
            name: string;
            icon: React.ReactElement;
            adminOnly?: boolean;
        }[] = [
            {
                to: routes.root,
                name: 'Home',
                icon: <HomeIcon className="h-6 w-6 mr-3" />
            },
            {
                to: routes.profile,
                name: 'My Profile',
                icon: <UserCircleIcon className="h-6 w-6 mr-3" />
            },
            {
                to: routes.users,
                name: 'Users',
                icon: <UsersIcon className="h-6 w-6 mr-3" />,
                adminOnly: true
            },
            {
                to: routes.contracts,
                name: 'Contracts',
                icon: <DocumentDuplicateIcon className="h-6 w-6 mr-3" />,
                adminOnly: true
            },
            {
                to: routes.leaves,
                name: 'Leaves',
                icon: <ClipboardDocumentIcon className="h-6 w-6 mr-3" />,
                adminOnly: true
            }
        ];

        const navLinks = [
            ...links
                .filter(
                    ({ adminOnly }) =>
                        isLoggedAsAdmin || !(isLoggedAsUser && adminOnly)
                )
                .map(({ to, name, icon }, i) => (
                    <Link
                        className={`flex items-center rounded w-full px-3 py-1 m-0 ${
                            pathname === to ? 'bg-sky-200' : ''
                        }`}
                        href={to}
                        key={`nav-link-${i}`}
                        onClick={handleNavClose}
                    >
                        {icon} {name}
                    </Link>
                )),
            <a
                className="flex items-center rounded px-3 py-1 m-0"
                key={`nav-link-${links.length}`}
                onClick={() => {
                    handleNavClose();
                    handleLogout();
                }}
            >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" /> Logout
            </a>
        ];

        return (
            <ul className="w-full p-4 min-w-[200px] cursor-pointer">
                {navLinks.map((navLink, i) => (
                    <li
                        className="w-full mb-2 p-0 text-md md:text-lg xl:text-xl hover:text-sky-600"
                        key={`nav-list-link-${i}`}
                    >
                        {navLink}
                    </li>
                ))}
            </ul>
        );
    }, [pathname, isLoggedAsAdmin, isLoggedAsUser]);

    return (
        <>
            <Bars3Icon
                className="h-6 w-6 lg:h-10 lg:w-10 text-gray-300 hover:text-gray-50 [text-shadow:_1px_1px_1px_rgb(0_0_0_/_75%)] cursor-pointer select-none"
                onClick={handleNavClick}
            />
            {isOpen
                ? createPortal(
                      <>
                          <animated.nav
                              style={{ transform: styles.transform }}
                              className="fixed w-200 h-screen top-[40px] md:top-[60px] xl:top-[80px] right-0 bg-gray-100 z-[200]"
                              ref={navRef}
                          >
                              {navListLinks}
                          </animated.nav>
                          <animated.div
                              style={{ opacity: styles.opacity }}
                              className="fixed w-screen h-screen top-[40px] md:top-[60px] xl:top-[80px] left-0 bg-gray-800 z-[101] pointer-events-none select-none"
                          />
                      </>,
                      document.body
                  )
                : null}
        </>
    );
};

export default Navigation;
