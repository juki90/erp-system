import { Contract } from 'types';
import type { CSSProperties } from 'react';

interface IContractListItem {
    index: number;
    contract: Contract;
    style: CSSProperties;
    isLoggedAsAdmin?: boolean;
}

export type { IContractListItem };
