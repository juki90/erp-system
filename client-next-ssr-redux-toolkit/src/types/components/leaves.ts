import { Leave } from 'types';
import type { CSSProperties } from 'react';

interface ILeaveListItem {
    index: number;
    leave: Leave;
    style: CSSProperties;
    isLoggedAsAdmin: boolean;
    handleConfirmLeave: (id: string) => void;
}

export type { ILeaveListItem };
