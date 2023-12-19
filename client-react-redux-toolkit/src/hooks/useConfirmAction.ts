import { useEffect } from 'react';
import useModal from 'hooks/useModal';

const useConfirmAction = (
    open: boolean,
    onConfirm: () => void,
    onDiscard: () => void
) => {
    const { isOpen, modalStyles, handleModalOpen, handleModalClose } =
        useModal();

    const handleConfirmAction = () => {
        onConfirm();
        handleModalClose();
    };

    const handleDiscardAction = () => {
        onDiscard();
        handleModalClose();
    };

    useEffect(() => {
        if (open) {
            handleModalOpen();
        }
    }, [open]);

    return {
        isOpen,
        modalStyles,
        handleModalOpen,
        handleConfirmAction,
        handleDiscardAction
    };
};

export default useConfirmAction;
