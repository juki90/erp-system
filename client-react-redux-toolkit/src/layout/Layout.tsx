import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'components/Header';

const Layout: React.FC = () => (
    <div className="w-full">
        <Header />
        <div
            id="container"
            className="container mt-[50px] md:mt-[75px] xl:mt-[100px] mx-auto py-4 px-4"
        >
            <Outlet />
        </div>
    </div>
);

export default Layout;
