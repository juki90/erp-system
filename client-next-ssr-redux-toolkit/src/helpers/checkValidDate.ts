import dayjs from 'dayjs';

import { DATE_FORMAT } from 'config/constants';

const checkValidDate = (date: string): boolean =>
    dayjs(date, DATE_FORMAT).isValid();

export default checkValidDate;
