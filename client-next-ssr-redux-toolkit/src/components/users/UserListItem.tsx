import dayjs from 'dayjs';
import Link from 'next/link';
import PropTypes, { type Validator } from 'prop-types';
import { useContext, type FC, type CSSProperties } from 'react';
import {
    PencilSquareIcon,
    UserCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/solid';

import { routes } from 'routes';
import UserContext from 'context/users';
import { DATE_FORMAT } from 'config/constants';

import type { IUserListItem } from 'types';

const UserListItem: FC<IUserListItem> = ({
    index,
    user,
    user: {
        id,
        firstName,
        lastName,
        email,
        numberOfLeaveDays,
        birthDate,
        createdAt,
        updatedAt
    },
    ...rest
}) => {
    const { setUserToEdit, setUserToDelete } = useContext(UserContext);

    return (
        <div
            className="!w-full lg:flex h-full !pr-0 lg:!pr-4 border-b border-gray-400 max-xl:text-sm xl:text-base text-left"
            {...rest}
        >
            <div className="max-lg:flex w-full lg:w-[6.6%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400 max-lg:bg-gray-500 max-lg:text-gray-200 max-lg:font-bold">
                <span className="lg:hidden">#</span>
                <span>{index + 1}</span>
            </div>
            <div className="max-lg:flex w-full lg:w-[11.6%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400 truncate">
                <span className="lg:hidden mr-auto font-bold">First name</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {firstName}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[11.6%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400 truncate">
                <span className="lg:hidden mr-auto font-bold">Last name</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {lastName}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[18%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400 truncate">
                <span className="lg:hidden mr-auto font-bold">Email</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {email}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Birth date</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {birthDate}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Leaves</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {numberOfLeaveDays}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Created at</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {dayjs(createdAt).format(DATE_FORMAT)}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[10%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Updated at</span>
                <span className="w-[50%] text-right truncate lg:w-full">
                    {dayjs(updatedAt).format(DATE_FORMAT)}
                </span>
            </div>
            <div className="max-lg:flex w-full lg:w-[12.2%] lg:h-full h-[calc(100% / 9)] p-2 max-lg:border-b max-lg:border-gray-400">
                <span className="lg:hidden mr-auto font-bold">Actions</span>
                <div>
                    <Link href={`${routes.users}/${id}`}>
                        <UserCircleIcon className="inline-block h-4 xl:h-6 w-4 xl:w-6 mr-2 text-md text-sky-800 hover:text-sky-600 cursor-pointer" />
                    </Link>
                    <PencilSquareIcon
                        className="inline-block h-4 xl:h-6 w-4 xl:w-6 mr-2 text-md text-sky-800 hover:text-sky-600 cursor-pointer"
                        onClick={() => setUserToEdit!(user)}
                    />
                    <XCircleIcon
                        className="inline-block h-4 xl:h-6 w-4 xl:w-6 text-md text-red-900 hover:text-red-600 cursor-pointer"
                        onClick={() => setUserToDelete!(user)}
                    />
                </div>
            </div>
        </div>
    );
};

UserListItem.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired as Validator<CSSProperties>,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        numberOfLeaveDays: PropTypes.number.isRequired,
        birthDate: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
    }).isRequired
};

export default UserListItem;
