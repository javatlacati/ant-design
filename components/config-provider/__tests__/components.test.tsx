import React from 'react';
import { render } from 'enzyme';
import moment from 'moment';
import ConfigProvider from '..';
import Alert from '../../alert';
import Anchor from '../../anchor';
import AutoComplete from '../../auto-complete';
import Avatar from '../../avatar';
import BackTop from '../../back-top';
import Badge from '../../badge';
import Breadcrumb from '../../breadcrumb';
import Button from '../../button';
import Calendar from '../../calendar';
import Card from '../../card';
import Carousel from '../../carousel';
import Cascader from '../../cascader';
import Checkbox from '../../checkbox';
import Collapse from '../../collapse';
import Comment from '../../comment';
import DatePicker from '../../date-picker';
import Divider from '../../divider';
import Drawer from '../../drawer';
import Dropdown from '../../dropdown';
import Form from '../../form';
import { Row, Col } from '../../grid';
import Input from '../../input';
import InputNumber from '../../input-number';
import Layout from '../../layout';
import List from '../../list';
import Mention from '../../mention';
import Menu from '../../menu';
import Modal from '../../modal';
import Pagination from '../../pagination';
import Popconfirm from '../../popconfirm';
import Popover from '../../popover';
import Progress from '../../progress';
import Radio from '../../radio';
import Rate from '../../rate';
import Select from '../../select';
import Skeleton from '../../skeleton';
import Slider from '../../slider';
import Spin from '../../spin';
import Statistic from '../../statistic';
import Steps from '../../steps';
import Switch from '../../switch';
import Table from '../../table';
import Tabs from '../../tabs';
import Tag from '../../tag';
import TimePicker from '../../time-picker';
import Timeline from '../../timeline';
import Tooltip from '../../tooltip';
import Transfer from '../../transfer';
import Tree from '../../tree';
import TreeSelect from '../../tree-select';
import Upload from '../../upload';

jest.mock('draft-js/lib/generateRandomKey', () => () => '123');
jest.mock('rc-util/lib/Portal');

describe('ConfigProvider', () => {
  describe('components', () => {
    function testPair(name: string, renderComponent: any) {
      describe(`${name}`, () => {
        // normal
        it('normal', () => {
          expect(render(renderComponent({}))).toMatchSnapshot();
        });

        // prefixCls
        it('prefixCls', () => {
          expect(render(renderComponent({ prefixCls: `prefix-${name}` }))).toMatchSnapshot();
        });

        // configProvider
        it('configProvider', () => {
          expect(
            render(<ConfigProvider prefixCls="config">{renderComponent({})}</ConfigProvider>),
          ).toMatchSnapshot();
        });
      });
    }

    // Alert
    testPair('Alert', (props: any) => (
      <Alert {...props} message="Bamboo is Little Light" type="success" />
    ));

    // Anchor
    testPair('Anchor', (props: any) => (
      <Anchor {...props}>
        <Anchor.Link {...props} href="#bamboo" title="Little Light" />
      </Anchor>
    ));

    // AutoComplete
    testPair('AutoComplete', (props: any) => <AutoComplete {...props} />);

    // Avatar
    testPair('Avatar', (props: any) => <Avatar {...props} />);

    // BackTop
    testPair('BackTop', (props: any) => <BackTop visible {...props} />);

    // Badge
    testPair('Badge', (props: any) => {
      const newProps = {
        ...props,
      };

      // Hook for additional `scrollNumberPrefixCls` prop
      if (props.prefixCls) {
        newProps.scrollNumberPrefixCls = 'prefix-scroll-number';
      }

      return (
        <div>
          <Badge {...newProps} count={5}>
            <span />
          </Badge>

          <Badge {...newProps} dot>
            <span />
          </Badge>
        </div>
      );
    });

    // Breadcrumb
    testPair('Breadcrumb', (props: any) => (
      <Breadcrumb {...props}>
        <Breadcrumb.Item {...props}>Bamboo</Breadcrumb.Item>
        <Breadcrumb.Item {...props}>Light</Breadcrumb.Item>
      </Breadcrumb>
    ));

    // Button
    testPair('Button', (props: any) => (
      <div>
        <Button {...props}>Bamboo</Button>
        <Button.Group {...props}>
          <Button {...props}>Little</Button>
          <Button {...props}>Light</Button>
        </Button.Group>
      </div>
    ));

    // Calendar
    testPair('Calendar', (props: any) => (
      <div>
        <Calendar {...props} value={moment('2000-09-03')} mode="month" />
        <Calendar {...props} value={moment('2000-09-03')} mode="year" />
      </div>
    ));

    // Card
    testPair('Card', (props: any) => (
      <Card {...props}>
        <Card.Grid {...props}>
          <Card.Meta {...props} />
        </Card.Grid>
      </Card>
    ));

    // Carousel
    testPair('Carousel', (props: any) => (
      <Carousel {...props}>
        <div>
          <h3>Bamboo</h3>
        </div>
        <div>
          <h3>Light</h3>
        </div>
      </Carousel>
    ));

    // Cascader
    testPair('Cascader', (props: any) => <Cascader {...props} options={[]} showSearch />);

    // Checkbox
    testPair('Checkbox', (props: any) => (
      <Checkbox.Group {...props}>
        <Checkbox {...props}>Bamboo</Checkbox>
      </Checkbox.Group>
    ));

    // Collapse
    testPair('Collapse', (props: any) => (
      <Collapse {...props}>
        <Collapse.Panel key={1} header="Bamboo">
          <p>Light</p>
        </Collapse.Panel>
      </Collapse>
    ));

    // Comment
    testPair('Comment', (props: any) => (
      <Comment {...props} content="Bamboo">
        <Comment {...props} content="Light" />
      </Comment>
    ));

    // DatePicker
    describe('DatePicker', () => {
      testPair('DatePicker', (props: any) => (
        <div>
          <DatePicker {...props} />
        </div>
      ));

      // RangePicker
      testPair('RangePicker', (props: any) => (
        <div>
          <DatePicker.RangePicker {...props} />
        </div>
      ));

      // MonthPicker
      testPair('MonthPicker', (props: any) => (
        <div>
          <DatePicker.MonthPicker {...props} />
        </div>
      ));

      // WeekPicker
      testPair('WeekPicker', (props: any) => (
        <div>
          <DatePicker.WeekPicker {...props} />
        </div>
      ));
    });

    // Divider
    testPair('Divider', (props: any) => <Divider {...props} />);

    // Drawer
    testPair('Drawer', (props: any) => <Drawer {...props} visible getContainer={false} />);

    // Dropdown
    testPair('Dropdown', (props: any) => {
      const menu = (
        <Menu {...props}>
          <Menu.Item {...props}>Bamboo</Menu.Item>
        </Menu>
      );

      return (
        <Dropdown.Button {...props} overlay={menu}>
          Light
        </Dropdown.Button>
      );
    });

    // Form
    testPair('Form', (props: any) => (
      <Form {...props}>
        <Form.Item {...props} validateStatus="error" help="Bamboo is Light">
          <Input {...props} />
        </Form.Item>
      </Form>
    ));

    // Grid
    testPair('Grid', (props: any) => {
      const rowProps: any = {};
      const colProps: any = {};
      if (props.prefixCls) {
        rowProps.prefixCls = 'prefix-row';
        colProps.prefixCls = 'prefix-col';
      }

      return (
        <Row {...rowProps}>
          <Col {...colProps} span={1} />
        </Row>
      );
    });

    // Input
    testPair('Input', (props: any) => (
      <div>
        <Input.Group {...props}>
          <Input {...props} />
          <Input.Search {...props} />
        </Input.Group>
        <Input.TextArea {...props} />
      </div>
    ));

    // InputNumber
    testPair('InputNumber', (props: any) => <InputNumber {...props} />);

    // Layout
    testPair('Layout', (props: any) => {
      const siderProps: any = {};
      const headerProps: any = {};
      const contentProps: any = {};
      const footerProps: any = {};
      if (props.prefixCls) {
        siderProps.prefixCls = 'prefix-sider';
        headerProps.prefixCls = 'prefix-header';
        contentProps.prefixCls = 'prefix-content';
        footerProps.prefixCls = 'prefix-footer';
      }

      return (
        <Layout {...props}>
          <Layout.Sider {...siderProps} />
          <Layout {...props}>
            <Layout.Header {...headerProps} />
            <Layout.Content {...contentProps} />
            <Layout.Footer {...footerProps} />
          </Layout>
        </Layout>
      );
    });

    // List
    testPair('List', (props: any) => (
      <List
        {...props}
        itemLayout="horizontal"
        dataSource={['']}
        renderItem={() => (
          <List.Item {...props}>
            <List.Item.Meta
              {...props}
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="Ant Design"
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    ));

    // Mention
    testPair('Mention', (props: any) => <Mention {...props} />);

    // Menu
    testPair('Menu', (props: any) => (
      <Menu {...props} defaultOpenKeys={['bamboo']} mode="inline">
        <Menu.SubMenu {...props} key="bamboo" title="bamboo">
          <Menu.ItemGroup {...props} key="g1" title="Item 1">
            <Menu.Item {...props} key="1">
              Light
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu.SubMenu>
      </Menu>
    ));

    // Modal
    testPair('Modal', (props: any) => (
      <div>
        <Modal {...props} visible getContainer={false}>
          Bamboo is Little Light
        </Modal>
      </div>
    ));

    // Pagination
    testPair('Pagination', (props: any) => (
      <div>
        <Pagination showSizeChanger showQuickJumper {...props} />
        <Pagination size="small" showSizeChanger showQuickJumper {...props} />
      </div>
    ));

    // Popconfirm
    testPair('Popconfirm', (props: any) => (
      <div>
        <Popconfirm {...props} visible>
          <span>Bamboo</span>
        </Popconfirm>
      </div>
    ));

    // Popover
    testPair('Popover', (props: any) => (
      <div>
        <Popover {...props} visible>
          <span>Light</span>
        </Popover>
      </div>
    ));

    // Progress
    testPair('Progress', (props: any) => <Progress {...props} />);

    // Radio
    testPair('Radio', (props: any) => (
      <div>
        <Radio.Group {...props}>
          <Radio {...props}>Bamboo</Radio>
        </Radio.Group>
        <Radio.Group {...props}>
          <Radio.Button {...props}>Light</Radio.Button>
        </Radio.Group>
      </div>
    ));

    // Rate
    testPair('Rate', (props: any) => <Rate {...props} />);

    // Select
    testPair('Select', (props: any) => (
      <Select {...props} open>
        <Select.OptGroup key="grp">
          <Select.Option key="Bamboo">Light</Select.Option>
        </Select.OptGroup>
      </Select>
    ));

    // Skeleton
    testPair('Skeleton', (props: any) => <Skeleton title avatar paragraph {...props} />);

    // Slider
    testPair('Slider', (props: any) => {
      const myProps = { ...props };
      if (myProps.prefixCls) {
        myProps.tooltipPrefixCls = `${myProps.prefixCls}-tooltip`;
      }
      return <Slider tooltipVisible {...myProps} />;
    });

    // Spin
    testPair('Spin', (props: any) => <Spin {...props} />);

    // Statistic
    testPair('Statistic', (props: any) => <Statistic {...props} value={0} />);

    // Steps
    testPair('Steps', (props: any) => {
      const myProps = { ...props };
      if (props.prefixCls) {
        myProps.iconPrefix = 'prefixIcon';
      }
      return (
        <Steps {...props}>
          <Steps.Step title="Bamboo" description="Little Light" />
        </Steps>
      );
    });

    // Switch
    testPair('Switch', (props: any) => <Switch {...props} />);

    // Table
    testPair('Table', (props: any) => {
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          filters: [
            {
              text: 'Joe',
              value: 'Joe',
            },
            {
              text: 'Submenu',
              value: 'Submenu',
              children: [
                {
                  text: 'Green',
                  value: 'Green',
                },
              ],
            },
          ],
          filterDropdownVisible: true,
          onFilter: (value: any, record: any) => record.name.indexOf(value) === 0,
          sorter: (a: any, b: any) => a.name.length - b.name.length,
        },
      ];

      const myProps = { ...props };
      if (props.prefixCls) {
        myProps.dropdownPrefixCls = 'prefix-dropdown';
      }

      return <Table columns={columns} {...props} />;
    });

    // Tabs
    testPair('Tabs', (props: any) => (
      <Tabs {...props}>
        <Tabs.TabPane tab="Bamboo" key="Light" />
      </Tabs>
    ));

    // Tags
    testPair('Tags', (props: any) => (
      <div>
        <Tag {...props}>Bamboo</Tag>
        <Tag.CheckableTag {...props}>Light</Tag.CheckableTag>
      </div>
    ));

    // TimePicker
    testPair('TimePicker', (props: any) => (
      <TimePicker {...props} open defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
    ));

    // Timeline
    testPair('Timeline', (props: any) => (
      <Timeline {...props}>
        <Timeline.Item {...props}>Bamboo</Timeline.Item>
      </Timeline>
    ));

    // Tooltip
    testPair('Tooltip', (props: any) => (
      <Tooltip {...props} title="Bamboo" visible>
        <span>Light</span>
      </Tooltip>
    ));

    // Transfer
    testPair('Transfer', (props: any) => <Transfer {...props} dataSource={[]} />);

    // Tree
    testPair('Tree', (props: any) => (
      <div>
        <Tree {...props}>
          <Tree.TreeNode title="bamboo" />
        </Tree>

        <Tree.DirectoryTree {...props}>
          <Tree.TreeNode title="bamboo" />
        </Tree.DirectoryTree>
      </div>
    ));

    // TreeSelect
    testPair('TreeSelect', (props: any) => (
      <TreeSelect {...props} open>
        <TreeSelect.TreeNode title="bamboo" value="light" />
      </TreeSelect>
    ));

    // Upload
    testPair('Upload', (props: any) => (
      <Upload
        {...props}
        defaultFileList={[
          {
            uid: '1',
            name: 'xxx.png',
            status: 'done',
          },
        ]}
      >
        <span />
      </Upload>
    ));
  });
});
