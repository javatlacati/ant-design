import React from 'react';
import { mount, ReactWrapper, render } from 'enzyme';
import Tabs from '..';

const { TabPane } = Tabs;

describe('Tabs', () => {
  describe('editable-card', () => {
    let handleEdit: any;
    let wrapper: ReactWrapper;

    beforeEach(() => {
      handleEdit = jest.fn();
      wrapper = mount(
        <Tabs type="editable-card" onEdit={handleEdit}>
          <TabPane tab="foo" key="1">
            foo
          </TabPane>
        </Tabs>,
      );
    });

    it('add card', () => {
      wrapper
        .find('.ant-tabs-new-tab')
        .hostNodes()
        .simulate('click');
      expect(handleEdit.mock.calls[0][1]).toBe('add');
    });

    it('remove card', () => {
      wrapper.find('.anticon-close').simulate('click');
      expect(handleEdit).toHaveBeenCalledWith('1', 'remove');
    });
  });

  describe('tabPosition', () => {
    it('remove card', () => {
      const wrapper = render(
        <Tabs tabPosition="left" tabBarExtraContent="xxx">
          <TabPane tab="foo" key="1">
            foo
          </TabPane>
        </Tabs>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('renderTabBar', () => {
    it('custom-tab-bar', () => {
      const wrapper = render(
        <Tabs renderTabBar={() => <div>custom-tab-bar</div>}>
          <TabPane tab="foo" key="1">
            foo
          </TabPane>
        </Tabs>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
