import React from 'react';
import { mount } from 'enzyme';
import message, { MessageType } from '..';
import Icon from '../../icon';

describe('message', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    message.destroy();
    jest.useRealTimers();
  });

  it('should be able to config top', () => {
    message.config({
      top: 100,
    });
    message.info('whatever');
    const elementNodeListOfElement: any = document.querySelectorAll('.ant-message')[0];
    expect(elementNodeListOfElement.style.top).toBe('100px');
  });

  it('should be able to config getContainer', () => {
    message.config({
      getContainer: () => {
        const div = document.createElement('div');
        div.className = 'custom-container';
        document.body.appendChild(div);
        return div;
      },
    });
    message.info('whatever');
    expect(document.querySelectorAll('.custom-container').length).toBe(1);
  });

  it('should be able to config maxCount', () => {
    message.config({
      maxCount: 5,
    });
    for (let i = 0; i < 10; i += 1) {
      message.info('test');
    }
    message.info('last');
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(5);
    expect(document.querySelectorAll('.ant-message-notice')[4].textContent).toBe('last');
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('should be able to hide manually', () => {
    const hide1 = message.info('whatever', 0);
    const hide2 = message.info('whatever', 0);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    hide1();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(1);
    hide2();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('should be able to destroy globally', () => {
    message.info('whatever', 0);
    message.info('whatever', 0);
    expect(document.querySelectorAll('.ant-message').length).toBe(1);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    message.destroy();
    expect(document.querySelectorAll('.ant-message').length).toBe(0);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('should not need to use duration argument when using the onClose arguments', () => {
    message.info('whatever', () => {});
  });

  it('should have the default duration when using the onClose arguments', done => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    message.info('whatever', () => {
      // calculate the approximately duration value
      const aboutDuration = ~~((Date.now() - now) / 1000);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    });
  });

  it('should be called like promise', done => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    const content: any = 'whatever';
    message.info(content).then(() => {
      // calculate the approximately duration value
      const aboutDuration = ~~((Date.now() - now) / 1000);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    }, ()=>{});
  });

  // https://github.com/ant-design/ant-design/issues/8201
  it('should hide message correctly', () => {
    let hide: MessageType;
    class Test extends React.Component {
      componentDidMount() {
        hide = message.loading('Action in progress..', 0);
      }

      render() {
        return <div>test</div>;
      }
    }
    mount(<Test />);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(1);
    // @ts-ignore
    if(hide) {
      hide();
    }
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('should allow custom icon', () => {
    const args: any = { content: 'Message', icon: <Icon type="smile-o" /> };
    message.open(args);
    expect(document.querySelectorAll('.anticon-smile-o').length).toBe(1);
  });

  it('should have no icon', () => {
    const args: any = { content: 'Message' };
    message.open(args);
    expect(document.querySelectorAll('.ant-message-notice .anticon').length).toBe(0);
  });

  // https://github.com/ant-design/ant-design/issues/8201
  it('should destroy messages correctly', () => {
    // eslint-disable-next-line
    class Test extends React.Component {
      componentDidMount() {
        message.loading('Action in progress1..', 0);
        message.loading('Action in progress2..', 0);
        setTimeout(() => message.destroy(), 1000);
      }

      render() {
        return <div>test</div>;
      }
    }
    mount(<Test />);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });
});
