import { SingleValue } from 'react-select';

interface IPageHeading {
    children?: string;
}

interface IConfirmAction {
    open: boolean;
    title: string;
    question: string;
    onConfirm: () => void;
    onDiscard: () => void;
}

interface IUserPicker {
    preselectedUserId?: string;
    setSelectedUser: (
        userOption: SingleValue<{ value: string; label: string }>
    ) => void;
}

export type { IPageHeading, IConfirmAction, IUserPicker };
