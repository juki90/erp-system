import { createContext } from 'react';
import { Leave } from 'types';

const LeaveContext = createContext<{
    isLoggedAsAdmin: undefined | boolean;
    leaveToEdit: undefined | Leave;
    leaveToDelete: undefined | Leave;
    setLeaveToEdit: ((leave: Leave | undefined) => void) | undefined;
    setLeaveToDelete: ((leave: Leave | undefined) => void) | undefined;
}>({
    isLoggedAsAdmin: undefined,
    setLeaveToEdit: undefined,
    leaveToEdit: undefined,
    setLeaveToDelete: undefined,
    leaveToDelete: undefined
});

export default LeaveContext;
