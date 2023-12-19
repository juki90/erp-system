import type { SingleValue } from 'react-select';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

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
    label: string;
    htmlFor: string;
    errorField?: FieldError;
    description?: string;
    preselectedUserId?: string;
    isProfileView?: boolean;
    setSelectedUser: (
        userOption: SingleValue<{ value: string; label: string }>
    ) => void;
}

interface IFormDatePicker {
    label: string;
    htmlFor: string;
    readOnly?: boolean;
    fieldProps: UseFormRegisterReturn<string>;
    errorField?: FieldError;
    dateWatcher: string;
    labelClassName?: string;
    handleChangeDate: (date: Date | null | undefined) => void;
}

interface IFormInput {
    label: string;
    htmlFor: string;
    readOnly?: boolean;
    fieldProps?: UseFormRegisterReturn<string>;
    errorField?: FieldError;
    labelClassName?: string;
    type?: string;
    value?: string;
    className?: string;
}

interface IFormRadio {
    label: string;
    readOnly?: boolean;
    fieldProps?: UseFormRegisterReturn<string>;
    errorField?: FieldError;
    options: { label: string; value: string }[];
    type?: string;
    value?: string;
    className?: string;
    getValue: () => string | number;
}

interface IFormSelect {
    label: string;
    htmlFor: string;
    fieldProps: UseFormRegisterReturn<string>;
    errorField?: FieldError;
    options: { label: string; value: string | number }[];
}

interface IFormCheckbox {
    label: string;
    htmlFor: string;
    description: string;
    fieldProps: UseFormRegisterReturn<string>;
    errorField?: FieldError;
    labelClassName?: string;
}

export type {
    IFormInput,
    IFormRadio,
    IFormSelect,
    IUserPicker,
    IPageHeading,
    IFormCheckbox,
    IConfirmAction,
    IFormDatePicker
};
