import dayjs from 'dayjs';
import {getRandomNum} from './utils-common.js';
import {SortType} from '../const.js';

const generateRandomIndex = (data) => {
  const randomData = data[getRandomNum(0, data.length - 1)];
  return randomData;
};

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const sortData = (data, parameter) => {
  switch (parameter) {
    case SortType.TIME:
      data.sort((left, right) => {
        return right[parameter] - left[parameter];
      });
      break;
    case SortType.PRICE:
      data.sort((left, right) => {
        return right[parameter] - left[parameter];
      });
      break;
    default:
      data.sort((left, right) => {
        return left[parameter].START - right[parameter].START;
      });
  }
  return data;
};

const isPastEvent = (event) => {
  return event.date.START < dayjs();
};

export {
  generateRandomIndex,
  humanizeDate,
  sortData,
  SortType,
  isPastEvent,
};
