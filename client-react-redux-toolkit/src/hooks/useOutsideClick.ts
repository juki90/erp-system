import { useEffect, type RefObject } from 'react';

const useOutsideClick = (
    ref: RefObject<HTMLElement> | null,
    callback: () => void
) => {
    const handleClick: (e: MouseEvent) => void = e => {
        if (ref?.current && !ref.current.contains(e.target as Node)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    });
};

export default useOutsideClick;
