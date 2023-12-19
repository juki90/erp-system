import DatePicker from 'react-datepicker';
import PropTypes, { type Validator } from 'prop-types';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';

import type { FC } from 'react';
import type { IFormDatePicker } from 'types';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const FormDatePicker: FC<IFormDatePicker> = ({
    label,
    htmlFor,
    fieldProps,
    errorField,
    dateWatcher,
    labelClassName,
    handleChangeDate,
    ...rest
}) => (
    <div className="relative mb-4 pb-3">
        <label
            htmlFor={htmlFor}
            className={labelClassName || 'block text-gray-800 mb-2'}
        >
            Birth date
        </label>
        <DatePicker
            showYearDropdown
            showPopperArrow={false}
            popperPlacement="top-start"
            dateFormat="yyyy-MM-dd"
            selected={new Date(dateWatcher)}
            portalId="root"
            customInput={
                <div className="flex items-center">
                    <input
                        id={htmlFor}
                        className="w-full py-1 px-2 rounded border-2 border-gray-400 cursor-pointer"
                        readOnly
                        value={dateWatcher}
                        {...fieldProps}
                        {...rest}
                    />
                    <CalendarDaysIcon className="h-6 w-6 -ml-8 text-gray-600" />
                </div>
            }
            onChange={handleChangeDate}
        />
        {errorField ? (
            <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                {errorField?.message as string}
            </small>
        ) : null}
    </div>
);

FormDatePicker.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
    fieldProps: PropTypes.object.isRequired as Validator<
        UseFormRegisterReturn<string>
    >,
    errorField: PropTypes.object as Validator<FieldError | undefined>,
    dateWatcher: PropTypes.string.isRequired,
    handleChangeDate: PropTypes.func.isRequired,
    labelClassName: PropTypes.string
};

export default FormDatePicker;
