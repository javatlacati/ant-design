import React from 'react';
import { mount } from 'enzyme';
import Collapse from '..';

describe('Collapse', () => {
  it('should support remove expandIcon', () => {
    const wrapper = mount(
      <Collapse expandIcon={() => null}>
        <Collapse.Panel key={1} header="header" />
      </Collapse>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should render extra node of panel', () => {
    const wrapper = mount(
      <Collapse>
        <Collapse.Panel key={1} header="header" extra={<button type="button">action</button>} />
        <Collapse.Panel key={2} header="header" extra={<button type="button">action</button>} />
      </Collapse>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });
});
