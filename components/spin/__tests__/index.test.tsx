import React from 'react';
import { render, mount } from 'enzyme';
import Spin from '..';

describe('Spin', () => {
  it('should only affect the spin element when set style to a nested <Spin>xx</Spin>', () => {
    const wrapper = mount(
      <Spin style={{ background: 'red' }}>
        <div>content</div>
      </Spin>,
    );
    expect(
      wrapper
        .find('.ant-spin-nested-loading')
        .at(0)
        .prop('style'),
    ).toBeFalsy();
    const prop = wrapper
      .find('.ant-spin')
      .at(0)
      .prop('style');
    if (prop) {
      expect(
        prop.background,
      ).toBe('red');
    }
  });

  it("should render custom indicator when it's set", () => {
    const customIndicator = <div className="custom-indicator" />;
    const wrapper = render(<Spin indicator={customIndicator} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should be controlled by spinning', () => {
    const wrapper = mount<Spin>(<Spin spinning={false} />);
    expect(wrapper.instance().state.spinning).toBe(false);
    wrapper.setProps({ spinning: true });
    expect(wrapper.instance().state.spinning).toBe(true);
  });
});
