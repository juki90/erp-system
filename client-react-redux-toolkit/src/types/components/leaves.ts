import { CSSProperties } from 'react';
import { Leave } from 'types';

interface ILeaveListItem {
    index: number;
    leave: Leave;
    style: CSSProperties;
    isLoggedAsAdmin: boolean;
    handleConfirmLeave: (id: string) => void;
}

export type { ILeaveListItem };
