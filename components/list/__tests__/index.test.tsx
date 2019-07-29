import React from 'react';
import { mount } from 'enzyme';
import List from '..';

const ListItem = List.Item;

describe('List', () => {
  it('locale not passed to internal div', async () => {
    const locale = { emptyText: 'Custom text' };
    const renderItem = (item: any) => <ListItem>{item}</ListItem>;
    const dataSource: any = [];

    const wrapper = mount<List<any>>(<List renderItem={renderItem} dataSource={dataSource} locale={locale} />);
    expect(
      wrapper
        .find('div')
        .first()
        .prop('locale'),
    ).toBe(undefined);
  });
});
