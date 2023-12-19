import { User } from 'types';
import type { CSSProperties } from 'react';

interface IUserList {
    serverSideRenderedUsers: User[];
}

interface IUserListItem {
    index: number;
    user: User;
    style: CSSProperties;
}

export type { IUserList, IUserListItem };
