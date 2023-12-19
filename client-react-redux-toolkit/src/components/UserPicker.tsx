import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import type { IUserPicker } from 'types';
import useUserPicker from 'hooks/useUserPicker';

const UserPicker: React.FC<IUserPicker> = ({
    preselectedUserId,
    setSelectedUser
}) => {
    const { usersOptions, isProfileView, preselectedUserOption } =
        useUserPicker(preselectedUserId, setSelectedUser);

    return (
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
            className="h-8 !border-gray-400 rounded !hover:border-gray-400"
            options={usersOptions}
            value={preselectedUserOption}
            onChange={setSelectedUser}
            isDisabled={isProfileView}
        />
    );
};

UserPicker.propTypes = {
    preselectedUserId: PropTypes.string,
    setSelectedUser: PropTypes.func.isRequired
};

export default UserPicker;
