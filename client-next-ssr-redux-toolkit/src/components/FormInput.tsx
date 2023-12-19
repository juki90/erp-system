import PropTypes, { type Validator } from 'prop-types';

import type { FC } from 'react';
import type { IFormInput } from 'types';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const FormInput: FC<IFormInput> = ({
    label,
    htmlFor,
    className,
    fieldProps,
    errorField,
    labelClassName,
    ...rest
}) => (
    <div className="relative mb-4 pb-3">
        <label
            htmlFor={htmlFor}
            className={labelClassName || 'block text-gray-800 mb-2'}
        >
            {label}
        </label>
        <input
            id={htmlFor}
            className={
                className || 'w-full py-1 px-2 rounded border-2 border-gray-400'
            }
            {...fieldProps}
            {...rest}
        />
        {errorField ? (
            <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                {errorField?.message as string}
            </small>
        ) : null}
    </div>
);

FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
    fieldProps: PropTypes.object as Validator<UseFormRegisterReturn<string>>,
    errorField: PropTypes.object as Validator<FieldError | undefined>,
    labelClassName: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    className: PropTypes.string
};

export default FormInput;
