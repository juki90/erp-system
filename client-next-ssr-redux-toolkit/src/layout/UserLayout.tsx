import React from 'react';

import Header from 'components/Header';

const UserLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col w-full h-screen justify-between">
        <Header />
        <div
            id="container"
            className="container mt-[50px] md:mt-[75px] xl:mt-[100px] mx-auto py-4 px-4"
        >
            {children}
        </div>
        <footer className="flex !min-h-[50px] bg-gray-600 items-center text-gray-100">
            <div className="container flex mx-auto px-5">
                <span className="ml-auto">ERP System Lukasz &copy; 2023</span>
            </div>
        </footer>
    </div>
);

export default UserLayout;
