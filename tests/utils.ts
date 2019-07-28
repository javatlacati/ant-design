import moment from 'moment';
import MockDate from 'mockdate';

export function setMockDate(dateString: string | number | Date = '2017-09-18T03:30:07.795') {
  // @ts-ignore
  MockDate.set(moment(dateString));
}

export function resetMockDate() {
  MockDate.reset();
}
