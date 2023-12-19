import { useMemo, type FC } from 'react';
import PropTypes, { type Validator } from 'prop-types';

import type { IFormSelect } from 'types';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const FormSelect: FC<IFormSelect> = ({
    label,
    options,
    htmlFor,
    fieldProps,
    errorField,
    ...rest
}) => {
    const optionList = useMemo(
        () =>
            options.map(({ label, value }) => (
                <option key={`select-option-${label}-${value}`} value={value}>
                    {label}
                </option>
            )),
        []
    );

    return (
        <div className="relative mb-4 pb-3">
            <label htmlFor={htmlFor} className="block text-gray-800 mb-2">
                {label}
            </label>
            <select
                id={htmlFor}
                className="w-full relative py-1 px-2 rounded w-full border-2 border-gray-400 cursor-pointer appearance-none"
                {...fieldProps}
                {...rest}
            >
                {optionList}
            </select>
            <div className="flex items-center relative float-right -mt-[36px] p-[10px] cursor-pointer pointer-events-none">
                <span className="block h-[20px] w-[1px] mr-[8px] p-0 bg-gray-300 after:content-['\200b']" />
                <svg
                    className="fill-gray-300"
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                >
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                </svg>
            </div>
            {errorField ? (
                <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                    {errorField?.message as string}
                </small>
            ) : null}
        </div>
    );
};

FormSelect.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
    fieldProps: PropTypes.object.isRequired as Validator<
        UseFormRegisterReturn<string>
    >,
    errorField: PropTypes.object as Validator<FieldError | undefined>,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired
        }).isRequired
    ).isRequired
};

export default FormSelect;
