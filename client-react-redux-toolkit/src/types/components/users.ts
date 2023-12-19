import { User } from 'types';
import type { CSSProperties } from 'react';

interface IUserListItem {
    index: number;
    user: User;
    style: CSSProperties;
}

export type { IUserListItem };
