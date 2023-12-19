import { useMemo, type FC } from 'react';
import PropTypes, { type Validator } from 'prop-types';

import type { IFormRadio } from 'types';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const FormRadio: FC<IFormRadio> = ({
    label,
    options,
    fieldProps,
    errorField,
    getValue
}) => {
    const optionList = useMemo(
        () =>
            options.map(({ label, value }) => (
                <div
                    key={`radio-option-${label}-${value}`}
                    className="flex items-center mb-4"
                >
                    <input
                        {...fieldProps}
                        id={`${label}-${value}`}
                        type="radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 !border-transparent !outline-transparent cursor-pointer"
                        defaultChecked={getValue() === `${value}`}
                        value={`${value}`}
                    />
                    <label
                        htmlFor={`${label}-${value}`}
                        className="ml-2 text-sm font-medium text-gray-900"
                    >
                        {label}
                    </label>
                </div>
            )),
        []
    );

    return (
        <div className="relative mb-4 pb-3">
            <label className="block text-gray-800 mb-3">{label}</label>
            {optionList}
            {errorField ? (
                <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                    {errorField?.message as string}
                </small>
            ) : null}
        </div>
    );
};

FormRadio.propTypes = {
    label: PropTypes.string.isRequired,
    fieldProps: PropTypes.object as Validator<UseFormRegisterReturn<string>>,
    errorField: PropTypes.object as Validator<FieldError | undefined>,
    type: PropTypes.string,
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    className: PropTypes.string
};

export default FormRadio;
