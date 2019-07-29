import React from 'react';
import { mount } from 'enzyme';
import Affix from '..';
import { getObserverEntities } from '../utils';
import Button from '../../button';

const events: any = {};

class AffixMounter extends React.Component {

  public container: Window | HTMLElement ;
  public affix: Affix;

  public offsetBottom?: number;
  public offsetTop?: number;

  public onTestUpdatePosition?: Function;

  componentDidMount() {
    // @ts-ignore
    this.container.addEventListener = jest.fn().mockImplementation((event: any, cb: Function) => {
      events[event] = cb;
    });
  }

  getTarget = () => this.container;

  render() {
    // @ts-ignore
    return (<div ref={(node: HTMLElement ) => {
          this.container = node;
        }}
        className="container"
      >
        <Affix
          className="fixed"
          target={this.getTarget}
          ref={(ele: Affix ) => {
            this.affix = ele;
          }}
          {...this.props}
        >
          <Button type="primary">Fixed at the top of container</Button>
        </Affix>
      </div>
    );
  }
}

describe('Affix Render', () => {
  let wrapper;

  const classRect: any = {
    container: {
      top: 0,
      bottom: 100,
    },
  };

  const originGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return (
      classRect[this.className] || {
        top: 0,
        bottom: 0,
      }
    );
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    HTMLElement.prototype.getBoundingClientRect = originGetBoundingClientRect;
  });
  const movePlaceholder = (top: number) => {
    // @ts-ignore
    classRect.fixed = {
      top,
      bottom: top,
    };
    events.scroll({
      type: 'scroll',
    });
    jest.runAllTimers();
  };

  it('Anchor render perfectly', () => {
    document.body.innerHTML = '<div id="mounter" />';

    wrapper = mount<AffixMounter>(<AffixMounter />, { attachTo: document.getElementById('mounter') });
    jest.runAllTimers();

    movePlaceholder(0);
    expect(wrapper.instance().affix.state.affixStyle).toBeFalsy();

    movePlaceholder(-100);
    expect(wrapper.instance().affix.state.affixStyle).toBeTruthy();

    movePlaceholder(0);
    expect(wrapper.instance().affix.state.affixStyle).toBeFalsy();
  });

  it('support offsetBottom', () => {
    document.body.innerHTML = '<div id="mounter" />';

    // @ts-ignore
    wrapper = mount<AffixMounter>(<AffixMounter offsetBottom={0} />, {
      attachTo: document.getElementById('mounter'),
    });

    jest.runAllTimers();

    movePlaceholder(300);
    expect(wrapper.instance().affix.state.affixStyle).toBeTruthy();

    movePlaceholder(0);
    expect(wrapper.instance().affix.state.affixStyle).toBeFalsy();

    movePlaceholder(300);
    expect(wrapper.instance().affix.state.affixStyle).toBeTruthy();
  });

  it('updatePosition when offsetTop changed', () => {
    document.body.innerHTML = '<div id="mounter" />';

    // @ts-ignore
    wrapper = mount<AffixMounter>(<AffixMounter offsetTop={0} />, {
      attachTo: document.getElementById('mounter'),
    });
    jest.runAllTimers();

    movePlaceholder(-100);
    const state = wrapper.instance().affix.state as any;
    expect(state.affixStyle.top).toBe(0);
    // @ts-ignore
    wrapper.setProps({offsetTop: 10,});
    jest.runAllTimers();
    const state1 = wrapper.instance().affix.state as any;
    expect(state1.affixStyle.top).toBe(10);
  });

  describe('updatePosition when target changed', () => {
    it('function change', () => {
      document.body.innerHTML = '<div id="mounter" />';
      const container = document.querySelector('#id') as HTMLElement;
      const getTarget = () => container;
      wrapper = mount<Affix>(<Affix target={getTarget} />);
      // @ts-ignore
      wrapper.setProps({ target: null });
      const state = wrapper.instance().state as any;
      expect(state.status).toBe(0);
      expect(state.affixStyle).toBe(undefined);
      expect(state.placeholderStyle).toBe(undefined);
    });

    it('instance change', () => {
      const getObserverLength = () => Object.keys(getObserverEntities()).length;

      const container: HTMLDivElement = document.createElement('div');
      document.body.appendChild(container);
      let target: HTMLElement | null = container;

      const originLength = getObserverLength();
      const getTarget = () => target;
      wrapper = mount(<Affix target={getTarget} />);
      jest.runAllTimers();

      expect(getObserverLength()).toBe(originLength + 1);
      target = null;
      wrapper.setProps({});
      wrapper.update();
      jest.runAllTimers();
      expect(getObserverLength()).toBe(originLength);
    });
  });

  describe('updatePosition when size changed', () => {
    function test(name: string, index: number) {
      it(name, () => {
        document.body.innerHTML = '<div id="mounter" />';

        const updateCalled = jest.fn();
        // @ts-ignore
        wrapper = mount<AffixMounter>(<AffixMounter offsetBottom={0} onTestUpdatePosition={updateCalled} />, {
          attachTo: document.getElementById('mounter'),
        });

        jest.runAllTimers();

        movePlaceholder(300);
        expect(wrapper.instance().affix.state.affixStyle).toBeTruthy();
        jest.runAllTimers();
        wrapper.update();

        // Mock trigger resize
        updateCalled.mockReset();
        const instance = wrapper
          .find('ReactResizeObserver')
          .at(index)
          .instance() as any;
        instance
          .onResize();
        jest.runAllTimers();

        expect(updateCalled).toHaveBeenCalled();
      });
    }

    test('inner', 0);
    test('outer', 1);
  });
});
