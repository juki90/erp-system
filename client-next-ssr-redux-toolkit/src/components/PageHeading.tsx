import PropTypes from 'prop-types';

import type { FC } from 'react';
import type { IPageHeading } from '../types';

const PageHeading: FC<IPageHeading> = ({ children }) => (
    <h1 className="font-bold text-xl md:text-2xl xl:text-3xl [text-shadow:_1px_1px_1px_rgb(255_255_255_/_80%)] mb-2 px-4 py-2 bg-gray-200 rounded border-2 border-gray-300 mb-4">
        {children}
    </h1>
);

PageHeading.propTypes = {
    children: PropTypes.string.isRequired
};

export default PageHeading;
