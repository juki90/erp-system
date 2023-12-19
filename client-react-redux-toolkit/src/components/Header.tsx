import React from 'react';
import Navigation from 'components/Navigation';

const Header: React.FC = () => (
    <div className="fixed top-0 flex w-full h-[40px] md:h-[60px] xl:h-[80px] bg-gradient-ellipse-header z-50">
        <div className="flex items-center justify-between container mx-auto px-4">
            <div className="flex items-center text-gray-300 text-xl md:text-2xl xl:text-4xl [text-shadow:_1px_1px_1px_rgb(0_0_0_/_75%)]">
                <span className="select-none">
                    <span className="font-bold">ERP</span> System
                </span>
            </div>
            <Navigation />
        </div>
    </div>
);

export default Header;
