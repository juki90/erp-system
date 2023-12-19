import { createContext } from 'react';

import type { Leave } from 'types';

const LeaveContext = createContext<{
    leaveToEdit: undefined | Leave;
    leaveToDelete: undefined | Leave;
    setLeaveToEdit: ((leave: Leave | undefined) => void) | undefined;
    setLeaveToDelete: ((leave: Leave | undefined) => void) | undefined;
}>({
    leaveToEdit: undefined,
    leaveToDelete: undefined,
    setLeaveToEdit: undefined,
    setLeaveToDelete: undefined
});

export default LeaveContext;
