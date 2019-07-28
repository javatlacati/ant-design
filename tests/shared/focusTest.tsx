import React, { ComponentClass } from 'react';
import { mount } from 'enzyme';

export default function focusTest(Component: ComponentClass) {
  describe('focus and blur', () => {
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
      // @ts-ignore
      const wrapper = mount(<Component onFocus={handleFocus} />, { attachTo: container });
      // @ts-ignore
      wrapper.instance().focus();
      jest.runAllTimers();
      expect(handleFocus).toHaveBeenCalled();
    });

    it('blur() and onBlur', () => {
      const handleBlur = jest.fn();
      // @ts-ignore
      const wrapper = mount(<Component onBlur={handleBlur} />, { attachTo: container });
      // @ts-ignore
      wrapper.instance().focus();
      jest.runAllTimers();
      // @ts-ignore
      wrapper.instance().blur();
      jest.runAllTimers();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('autoFocus', () => {
      const handleFocus = jest.fn();
      // @ts-ignore
      mount(<Component autoFocus onFocus={handleFocus} />, { attachTo: container });
      jest.runAllTimers();
      expect(handleFocus).toHaveBeenCalled();
    });
  });
}
