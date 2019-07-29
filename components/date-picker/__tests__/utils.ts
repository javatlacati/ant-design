/* eslint-disable import/prefer-default-export */
import * as moment from "moment";
import { ReactWrapper } from "enzyme";

export function selectDate(wrapper: ReactWrapper, date: moment.Moment, index?: number) {
  let calendar = wrapper;
  if (index !== undefined) {
    calendar = wrapper.find('.ant-calendar-range-part').at(index);
  }
  calendar.find({ title: date.format('LL'), role: 'gridcell' }).simulate('click');
}

export function hasSelected(wrapper: ReactWrapper, date: moment.Moment) {
  return wrapper
    .find({ title: date.format('LL'), role: 'gridcell' })
    .hasClass('ant-calendar-selected-day');
}

export function openPanel(wrapper: ReactWrapper) {
  wrapper.find( '.ant-calendar-picker-input').simulate('click');
}

export function clearInput(wrapper: ReactWrapper) {
  wrapper
    .find('.ant-calendar-picker-clear')
    .hostNodes()
    .simulate('click');
}

export function nextYear(wrapper: ReactWrapper) {
  wrapper.find('.ant-calendar-next-year-btn').simulate('click');
}

export function nextMonth(wrapper: ReactWrapper) {
  wrapper.find('.ant-calendar-next-month-btn').simulate('click');
}
