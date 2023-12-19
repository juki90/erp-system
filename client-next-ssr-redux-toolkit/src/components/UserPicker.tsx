import React from 'react';
import Select from 'react-select';
import PropTypes, { type Validator } from 'prop-types';

import useUserPicker from 'hooks/useUserPicker';

import type { IUserPicker } from 'types';
import type { FieldError } from 'react-hook-form';

const UserPicker: React.FC<IUserPicker> = ({
    label,
    htmlFor,
    errorField,
    description,
    isProfileView,
    preselectedUserId,
    setSelectedUser
}) => {
    const { usersOptions, preselectedUserOption } = useUserPicker(
        preselectedUserId,
        setSelectedUser
    );

    return (
        <div className="relative mb-4  pb-4">
            <label id={htmlFor} className="block text-gray-800 mb-3">
                {label}
            </label>
            {description ? <p className="mb-4 text-sm">{description}</p> : null}
            <Select
                styles={{
                    dropdownIndicator: baseStyles => ({
                        ...baseStyles,
                        color: 'rgb(204, 204, 204) !important'
                    }),

                    control: baseStyles => ({
                        ...baseStyles,
                        margin: 0,
                        padding: 0,
                        border: '2px rgb(156, 163, 175) solid',
                        ':hover': {
                            border: '2px rgb(156, 163, 175) solid'
                        },
                        height: '36px',
                        minHeight: '36px',
                        cursor: 'pointer'
                    }),
                    valueContainer: baseStyles => ({
                        ...baseStyles,
                        height: '36px',
                        paddingTop: 0,
                        paddingLeft: '6px',
                        paddingRight: '6px',
                        margin: 0
                    }),
                    placeholder: baseStyles => ({
                        ...baseStyles,
                        height: '24px',
                        padding: 0,
                        margin: 0
                    })
                }}
                id={htmlFor}
                className="h-8 !border-gray-400 rounded !hover:border-gray-400"
                options={usersOptions}
                value={preselectedUserOption}
                onChange={setSelectedUser}
                isDisabled={isProfileView}
            />
            {errorField ? (
                <small className="block absolute bottom-0 h-2 text-red-500 -mt-1">
                    {errorField?.message as string}
                </small>
            ) : null}
        </div>
    );
};

UserPicker.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
    errorField: PropTypes.object as Validator<FieldError | undefined>,
    setSelectedUser: PropTypes.func.isRequired,
    description: PropTypes.string,
    isProfileView: PropTypes.bool,
    preselectedUserId: PropTypes.string
};

export default UserPicker;
