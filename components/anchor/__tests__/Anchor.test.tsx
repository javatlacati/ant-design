import React from 'react';
import { mount } from 'enzyme';
import Anchor from '..';
import { AnchorContainer } from "../Anchor";

const { Link } = Anchor;

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

describe('Anchor Render', () => {
  it('Anchor render perfectly', () => {
    const wrapper = mount<Anchor>(
      <Anchor>
        <Link href="#API" title="API" />
      </Anchor>,
    );

    wrapper.find('a[href="#API"]').simulate('click');

    wrapper.instance().handleScroll();
    expect(wrapper.instance().state).not.toBe(null);
  });

  it('Anchor render perfectly for complete href - click', () => {
    const wrapper = mount<Anchor>(
      <Anchor>
        <Link href="http://www.example.com/#API" title="API" />
      </Anchor>,
    );
    wrapper.find('a[href="http://www.example.com/#API"]').simulate('click');
    expect(wrapper.instance().state.activeLink).toBe('http://www.example.com/#API');
  });

  it('Anchor render perfectly for complete href - scroll', () => {
    let root = document.getElementById('root');
    if (!root) {
      // @ts-ignore
      root = document.createElement('div', { id: 'root' });
      if (root) {
        root.id = 'root';
        document.body.appendChild(root);
      }
    }
    mount(<div id="API">Hello</div>, { attachTo: root });
    const wrapper = mount<Anchor>(
      <Anchor>
        <Link href="http://www.example.com/#API" title="API" />
      </Anchor>,
    );
    wrapper.instance().handleScroll();
    expect(wrapper.instance().state.activeLink).toBe('http://www.example.com/#API');
  });

  it('Anchor render perfectly for complete href - scrollTo', async () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo');
    let root = document.getElementById('root');
    if (!root) {
      // @ts-ignore
      root = document.createElement('div', { id: 'root' });
      if (root) {
        root.id = 'root';
        document.body.appendChild(root);
      }
    }
    mount(<div id="API">Hello</div>, { attachTo: root });
    const wrapper = mount<Anchor>(
      <Anchor>
        <Link href="##API" title="API" />
      </Anchor>,
    );
    wrapper.instance().handleScrollTo('##API');
    expect(wrapper.instance().state.activeLink).toBe('##API');
    expect(scrollToSpy).not.toHaveBeenCalled();
    await delay(1000);
    expect(scrollToSpy).toHaveBeenCalled();
  });

  it('should remove listener when unmount', async () => {
    const wrapper = mount<Anchor>(
      <Anchor>
        <Link href="#API" title="API" />
      </Anchor>,
    );
    const removeListenerSpy = jest.spyOn(wrapper.instance()[`scrollEvent`], 'remove');
    wrapper.unmount();
    expect(removeListenerSpy).toHaveBeenCalled();
  });

  it('should unregister link when unmount children', async () => {
    const wrapper = mount<Anchor>(
      <Anchor>
        <Link href="#API" title="API" />
      </Anchor>,
    );
    expect(wrapper.instance()[`links`]).toEqual(['#API']);
    wrapper.setProps({ children: null });
    expect(wrapper.instance()[`links`]).toEqual([]);
  });

  it('should update links when link href update', async () => {
    let anchorInstance = mount<Anchor>(
      <Anchor>
        <Link href="#API" title="API" />
      </Anchor>,
    );
    function AnchorUpdate({ href }: {href: string}) {
      return (
        <Anchor
          ref={(c: any) => {
            anchorInstance = c;
          }}
        >
          <Link href={href} title="API" />
        </Anchor>
      );
    }
    const wrapper = mount(<AnchorUpdate href="#API" />);

    expect(anchorInstance).not.toBeNull();
    if (anchorInstance) {
      // @ts-ignore
      expect(anchorInstance[`links`]).toEqual(['#API']);
      wrapper.setProps({ href: '#API_1' });
      // @ts-ignore
      expect(anchorInstance[`links`]).toEqual(['#API_1']);
    }
  });

  it('Anchor onClick event', () => {
    let event: any;
    let link;
    const handleClick = (...arg: [any, { href: string, title: string } ]) => {
      [event, link] = arg;
    };

    const href = '#API';
    const title = 'API';

    const wrapper = mount<Anchor>(
      <Anchor onClick={handleClick}>
        <Link href={href} title={title} />
      </Anchor>,
    );

    wrapper.find(`a[href="${href}"]`).simulate('click');

    wrapper.instance().handleScroll();
    expect(event).not.toBe(undefined);
    expect(link).toEqual({ href, title });
  });

  it('Different function returns the same DOM', async () => {
    let root = document.getElementById('root');
    if (!root) {
      // @ts-ignore
      root = document.createElement('div', { id: 'root' });
      expect(root).not.toBeNull();
      if (root) {
        root.id = 'root';
        document.body.appendChild(root);
      }
    }
    mount(<div id="API">Hello</div>, { attachTo: root });
    const getContainerA = (): AnchorContainer => {
      return document.getElementById('API') as AnchorContainer;
    };
    const getContainerB = (): AnchorContainer => {
      return document.getElementById('API') as AnchorContainer;
    };

    const wrapper = mount<Anchor>(
      <Anchor getContainer={getContainerA}>
        <Link href="#API" title="API" />
      </Anchor>,
    );
    const removeListenerSpy = jest.spyOn(wrapper.instance()[`scrollEvent`], 'remove');
    await delay(1000);
    wrapper.setProps({ getContainer: getContainerB });
    expect(removeListenerSpy).not.toHaveBeenCalled();
  });

  it('Different function returns different DOM', async () => {
    let root = document.getElementById('root');
    if (!root) {
      // @ts-ignore
      root = document.createElement('div', { id: 'root' });
      if (root) {
        root.id = 'root';
        document.body.appendChild(root);
      }
    }
    mount(
      <div>
        <div id="API1">Hello</div>
        <div id="API2">World</div>
      </div>,
      { attachTo: root },
    );
    const getContainerA = () => {
      return document.getElementById('API1') as AnchorContainer;
    };
    const getContainerB = () => {
      return document.getElementById('API2') as AnchorContainer;
    };
    const wrapper = mount<Anchor>(
      <Anchor getContainer={getContainerA}>
        <Link href="#API1" title="API1" />
        <Link href="#API2" title="API2" />
      </Anchor>,
    );
    const removeListenerSpy = jest.spyOn(wrapper.instance()[`scrollEvent`], 'remove');
    expect(removeListenerSpy).not.toHaveBeenCalled();
    await delay(1000);
    wrapper.setProps({ getContainer: getContainerB });
    expect(removeListenerSpy).toHaveBeenCalled();
  });

  it('Same function returns the same DOM', () => {
    let root = document.getElementById('root');
    if (!root) {
      // @ts-ignore
      root = document.createElement('div', { id: 'root' });
      expect(root).not.toBeNull();
      if (root) {
        root.id = 'root';
        document.body.appendChild(root);
      }
    }
    mount(<div id="API">Hello</div>, { attachTo: root });
    const getContainer = () => document.getElementById('API') as AnchorContainer;
    const wrapper = mount<Anchor>(
      <Anchor getContainer={getContainer}>
        <Link href="#API" title="API" />
      </Anchor>,
    );
    wrapper.find('a[href="#API"]').simulate('click');
    wrapper.instance().handleScroll();
    expect(wrapper.instance().state).not.toBe(null);
  });

  it('Same function returns different DOM', async () => {
    let root = document.getElementById('root');
    if (!root) {
      // @ts-ignore
      root = document.createElement('div', { id: 'root' });
      expect(root).not.toBeNull();
      if (root) {
        root.id = 'root';
        document.body.appendChild(root);
      }
    }
    mount(
      <div>
        <div id="API1">Hello</div>
        <div id="API2">World</div>
      </div>,
      { attachTo: root },
    );
    const holdContainer = {
      container: document.getElementById('API1'),
    };
    const getContainer = () => {
      return holdContainer.container as AnchorContainer;
    };
    const wrapper = mount<Anchor>(
      <Anchor getContainer={getContainer}>
        <Link href="#API1" title="API1" />
        <Link href="#API2" title="API2" />
      </Anchor>,
    );
    const removeListenerSpy = jest.spyOn(wrapper.instance()[`scrollEvent`], 'remove');
    expect(removeListenerSpy).not.toHaveBeenCalled();
    await delay(1000);
    holdContainer.container = document.getElementById('API2');
    // @ts-ignore
    wrapper.setProps({ 'data-only-trigger-re-render': true });
    expect(removeListenerSpy).toHaveBeenCalled();
  });
});
