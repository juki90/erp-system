import { useState } from 'react';
import { useSpring } from '@react-spring/web';

const useModal = () => {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalStyles, api] = useSpring(() => ({
        from: { transform: 'translateY(100%) scale(0)', opacity: 0 },
        config: { duration: 300 }
    }));

    const handleModalOpen = () => {
        setIsOpening(!isOpening);

        if (isOpen && isOpening) {
            api.start({
                to: async animate => {
                    await animate({
                        to: {
                            transform: 'translateY(100%) scale(0)',
                            opacity: 0
                        }
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
                        to: {
                            transform: 'translateY(0%) scale(1)',
                            opacity: 0.6
                        }
                    });
                }
            });
        }
    };

    const handleModalClose = () => {
        api.start({
            to: async animate => {
                await animate({
                    to: {
                        transform: 'translateY(100%) scale(0)',
                        opacity: 0
                    }
                });

                setIsOpen(false);
                setIsOpening(false);
            }
        });
    };

    return {
        isOpen,
        modalStyles,
        handleModalOpen,
        handleModalClose
    };
};

export default useModal;
