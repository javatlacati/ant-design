import React from 'react';
import { mount } from 'enzyme';
import AutoComplete from '..';
// @ts-ignore
import focusTest from '../../../tests/shared/focusTest';
// import focusTest from './/tests/shared/focusTest.js';

describe('AutoComplete could be focus', () => {
  focusTest(AutoComplete);
});

describe('AutoComplete children could be focus', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('focus() and onFocus', () => {
    const handleFocus = jest.fn();
    const wrapper = mount(<AutoComplete onFocus={handleFocus} />, { attachTo: container });
    const component = wrapper
      .find('input')
      .instance() as any as HTMLInputElement;
    component
      .focus();
    jest.runAllTimers();
    expect(handleFocus).toHaveBeenCalled();
  });

  it('blur() and onBlur', () => {
    const handleBlur = jest.fn();
    const wrapper = mount<AutoComplete>(<AutoComplete onBlur={handleBlur} />, { attachTo: container });
    const component = wrapper
      .find('input')
      .instance() as any as HTMLInputElement;
    component
      .focus();
    jest.runAllTimers();
    component
      .blur();
    jest.runAllTimers();
    expect(handleBlur).toHaveBeenCalled();
  });
});
