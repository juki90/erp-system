import React from 'react';

import useProtectedRoute from 'hooks/useProtectedRoute';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    useProtectedRoute();

    return (
        <div className="flex flex-col w-full h-screen justify-between">
            <div className="w-full">{children}</div>
            <footer className="flex !min-h-[50px] bg-gray-600 items-center text-gray-100">
                <div className="container flex mx-auto px-5">
                    <span className="ml-auto">
                        ERP System Lukasz &copy; 2023
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default DefaultLayout;
