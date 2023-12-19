import PropTypes, { Validator } from 'prop-types';

import type { FC } from 'react';
import type { IFormCheckbox } from 'types';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const FormCheckbox: FC<IFormCheckbox> = ({
    label,
    htmlFor,
    fieldProps,
    errorField,
    description,
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
        <div className="flex items-center">
            <input
                id={htmlFor}
                type="checkbox"
                className="block !h-6 !w-6 mr-2 mx-0 rounded w-full border-2 border-gray-400"
                {...fieldProps}
                {...rest}
            />
            <span className="block min-w-[250px]">{description}</span>
        </div>
    </div>
);

FormCheckbox.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    fieldProps: PropTypes.object.isRequired as Validator<
        UseFormRegisterReturn<string>
    >,
    errorField: PropTypes.object as Validator<FieldError | undefined>,
    labelClassName: PropTypes.string
};

export default FormCheckbox;
