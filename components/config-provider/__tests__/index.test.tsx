import React from 'react';
import { mount } from 'enzyme';
import ConfigProvider from '..';
import Button from '../../button';

describe('ConfigProvider', () => {
  it('Content Security Policy', () => {
    const csp = { nonce: 'test-antd' };
    const wrapper = mount<ConfigProvider>(
      <ConfigProvider csp={csp}>
        <Button />
      </ConfigProvider>,
    );

    const component: any = wrapper.find('Wave').instance();
    expect(component.csp).toBe(csp);
  });

  it('autoInsertSpaceInButton', () => {
    const wrapper = mount(
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button>确定</Button>
      </ConfigProvider>,
    );

    expect(wrapper.find('Button').text()).toBe('确定');
  });
});
