import React from 'react';
import { mount } from 'enzyme';
import Switch from '..';
// @ts-ignore
import focusTest from '../../../tests/shared/focusTest';

describe('Switch', () => {
  focusTest(Switch);

  it('should has click wave effect', async () => {
    const wrapper = mount<Switch>(<Switch />);
    const domNode: any = wrapper
      .find('.ant-switch')
      .getDOMNode();
    domNode
      .click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper.render()).toMatchSnapshot();
  });
});
