import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const checkEndDateBeforeStartDate = (
    startDate: string,
    endDate: string
): boolean => dayjs(startDate).isSameOrBefore(dayjs(endDate));

export default checkEndDateBeforeStartDate;
