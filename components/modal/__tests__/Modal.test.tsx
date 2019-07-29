import React from 'react';
import { mount } from 'enzyme';
import Modal from '..';

jest.mock('rc-util/lib/Portal');

class ModalTester extends React.Component {
  public container: any;
  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  componentDidMount() {
    this.setState({ visible: true }); // eslint-disable-line react/no-did-mount-set-state
  }

  saveContainer = (container: any) => {
    this.container = container;
  };

  getContainer = () => this.container;

  render() {
    const {visible}: any = this.state;
    return (
      <div>
        <div ref={this.saveContainer} />
        <Modal {...this.props} visible={visible} getContainer={this.getContainer}>
          Here is content of Modal
        </Modal>
      </div>
    );
  }
}

describe('Modal', () => {
  it('render correctly', () => {
    const wrapper = mount(<ModalTester />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render without footer', () => {
    // @ts-ignore
    const wrapper = mount(<ModalTester footer={null} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('onCancel should be called', () => {
    const onCancel = jest.fn();
    const wrapper = mount<Modal>(<Modal onCancel={onCancel} />).instance();
    // @ts-ignore
    wrapper.handleCancel();
    expect(onCancel).toHaveBeenCalled();
  });

  it('onOk should be called', () => {
    const onOk = jest.fn();
    const wrapper = mount<Modal>(<Modal onOk={onOk} />).instance();
    // @ts-ignore
    wrapper.handleOk();
    expect(onOk).toHaveBeenCalled();
  });
});
