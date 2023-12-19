import type { Table } from 'react-virtualized';
import { useRef, useState, useLayoutEffect } from 'react';

import isSsr from 'helpers/isSsr';

const useResize = (model: string, numberOfDataRows = 0) => {
    if (isSsr) {
        return {};
    }

    const delay = 25;
    let isThrottled = false;

    const recalculateTableDimensions = () => {
        const mobileRowsNumberConfig: { [model: string]: number } = {
            users: 9,
            contracts: 8,
            leaves: 7
        };
        const width = window.innerWidth || 1920;
        const height = window.innerHeight || 700;
        const finalDimensions: {
            width?: number;
            height?: number;
            rowHeight?: number;
            headerHeight?: number;
        } = { width: 1920, height: 700, rowHeight: 40, headerHeight: 40 };
        let containerWidth = 1500;

        const pageContainer = document.querySelector('#container');

        if (pageContainer) {
            containerWidth = pageContainer.clientWidth;
        }

        const fixedHeight = Math.floor(height / 40) * 40;

        if (width >= 1280) {
            finalDimensions.height = fixedHeight - 300;
            finalDimensions.rowHeight = 40;
            finalDimensions.headerHeight = 40;
        } else if (width < 1280 && width >= 1024) {
            finalDimensions.height = fixedHeight - 270;
            finalDimensions.rowHeight = 35;
            finalDimensions.headerHeight = 35;
        } else {
            finalDimensions.height = fixedHeight - 270;
            finalDimensions.rowHeight =
                mobileRowsNumberConfig[model] * (35 + 1);
            finalDimensions.headerHeight = 35;
        }

        finalDimensions.width = containerWidth - 36;

        if (height < 480) {
            finalDimensions.height = 280;
        }

        const allRowsHeight =
            numberOfDataRows * finalDimensions.rowHeight +
            finalDimensions.headerHeight;

        if (allRowsHeight <= finalDimensions.height && width < 1024) {
            finalDimensions.height =
                allRowsHeight - finalDimensions.headerHeight;
        }

        if (allRowsHeight <= finalDimensions.height && width >= 1024) {
            finalDimensions.height = allRowsHeight;
        }

        return finalDimensions;
    };

    const tableRef = useRef<Table | null>(null);
    const [dimensionsForElement, setDimensionsForElement] = useState<{
        width?: number | undefined;
        height?: number | undefined;
        rowHeight?: number | undefined;
        headerHeight?: number | undefined;
    }>(recalculateTableDimensions());

    const getDimensionsForElement = () => {
        if (isThrottled) {
            return;
        }

        isThrottled = true;

        setDimensionsForElement(recalculateTableDimensions());

        if (tableRef?.current) {
            tableRef.current.recomputeRowHeights();
        }

        setTimeout(() => {
            isThrottled = false;

            setDimensionsForElement(recalculateTableDimensions());

            if (tableRef?.current) {
                tableRef.current.recomputeRowHeights();
            }
        }, delay);
    };

    useLayoutEffect(() => {
        setDimensionsForElement(recalculateTableDimensions());

        window.addEventListener('resize', getDimensionsForElement);

        return () => {
            window.removeEventListener('resize', getDimensionsForElement);
        };
    }, [numberOfDataRows]);

    return { dimensionsForElement, tableRef };
};

export default useResize;
