import React from 'react';
import { render, mount } from 'enzyme';
import Slider from '..';

describe('Slider', () => {
  it('should show tooltip when hovering slider handler', () => {
    const wrapper = mount<Slider>(<Slider defaultValue={30} />);
    wrapper
      .find('.ant-slider-handle')
      .at(0)
      .simulate('mouseEnter');
    const component: any = wrapper
      .find('Trigger')
      .instance();
    expect(
      render(
        component
          .getComponent(),
      ),
    ).toMatchSnapshot();
    wrapper
      .find('.ant-slider-handle')
      .at(0)
      .simulate('mouseLeave');
    const reactWrapper: any = wrapper
      .find('Trigger');
    expect(
      render(
        reactWrapper
          .instance()
          .getComponent(),
      ),
    ).toMatchSnapshot();
  });

  it('when tooltipVisible is true, tooltip should show always, or should never show', () => {
    let wrapper = mount(<Slider defaultValue={30} tooltipVisible />);
    expect(
      wrapper
        .find('.ant-tooltip-content')
        .at(0)
        .hasClass('ant-tooltip-hidden'),
    ).toBe(false);
    wrapper
      .find('.ant-slider-handle')
      .at(0)
      .simulate('mouseEnter');
    expect(
      wrapper
        .find('.ant-tooltip-content')
        .at(0)
        .hasClass('ant-tooltip-hidden'),
    ).toBe(false);
    wrapper
      .find('.ant-slider-handle')
      .at(0)
      .simulate('click');
    expect(
      wrapper
        .find('.ant-tooltip-content')
        .at(0)
        .hasClass('ant-tooltip-hidden'),
    ).toBe(false);
    wrapper = mount(<Slider defaultValue={30} tooltipVisible={false} />);
    expect(wrapper.find('.ant-tooltip-content').length).toBe(0);
  });
});
