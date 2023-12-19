import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'router';
import useNotFound from 'hooks/useNotFound';

const NotFoundPage: React.FC = () => {
    const { loggedUser } = useNotFound();

    return (
        <div className="flex w-full h-screen items-center justify-center">
            <div className="p-6 m-3 bg-gray-200 rounded">
                <h1 className="text-xl md:text-2xl xl:text-3xl mb-3">
                    Page not found
                </h1>
                <p>
                    The page you are looking for is not found. Go back to:{' '}
                    {loggedUser ? (
                        <Link className="text-blue-600" to={routes.root}>
                            Homepage
                        </Link>
                    ) : (
                        <Link className="text-blue-600" to={routes.login}>
                            Login page
                        </Link>
                    )}
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
