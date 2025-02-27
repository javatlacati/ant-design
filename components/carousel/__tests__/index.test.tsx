// @ts-ignore
const __awaiter: any = (this && this.__awaiter) || function (thisArg: any, _arguments: any, P: any, generator: any) {
    return new (P || (P = Promise))(function (resolve: Function, reject: Function) {
        function fulfilled(value: any) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value: any) { try { step(generator[`throw`](value)); } catch (e) { reject(e); } }
        function step(result: any) { result.done ? resolve(result.value) : new P(function (resolve: Function) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { mount } from 'enzyme';
import Carousel from '..';
describe('Carousel', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should has innerSlider', () => {
        const wrapper = mount<Carousel>(<Carousel>
        <div />
      </Carousel>);
        const { innerSlider } = wrapper.instance();
        const innerSliderFromRefs = wrapper.instance()[`slick`].innerSlider;
        expect(innerSlider).toBe(innerSliderFromRefs);
        expect(typeof innerSlider.slickNext).toBe('function');
    });
    it('should has prev, next and go function', () => {
        const wrapper = mount<Carousel>(<Carousel>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Carousel>);
        const { prev, next, goTo } = wrapper.instance();
        expect(typeof prev).toBe('function');
        expect(typeof next).toBe('function');
        expect(typeof goTo).toBe('function');
        expect(wrapper.instance()[`slick`].innerSlider.state.currentSlide).toBe(0);
        wrapper.instance().goTo(2);
        jest.runAllTimers();
        expect(wrapper.instance()[`slick`].innerSlider.state.currentSlide).toBe(2);
        wrapper.instance().prev();
        jest.runAllTimers();
        expect(wrapper.instance()[`slick`].innerSlider.state.currentSlide).toBe(1);
        wrapper.instance().next();
        jest.runAllTimers();
        expect(wrapper.instance()[`slick`].innerSlider.state.currentSlide).toBe(2);
    });
    it('should trigger autoPlay after window resize', () => __awaiter(this, void 0, void 0, function* () {
        jest.useRealTimers();
        const wrapper = mount<Carousel>(<Carousel autoplay>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Carousel>);
        const spy = jest.spyOn(wrapper.instance()[`slick`].innerSlider, 'autoPlay');
        // @ts-ignore
      window.resizeTo(1000);
        expect(spy).not.toHaveBeenCalled();
        yield new Promise(resolve => setTimeout(resolve, 500));
        expect(spy).toHaveBeenCalled();
    }));
    // @ts-ignore
  it('cancel resize listener when unmount', () => __awaiter(this, void 0, void 0, function* () {
        const wrapper = mount<Carousel>(<Carousel autoplay>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Carousel>);
        const { onWindowResized } = wrapper.instance();
        // @ts-ignore
      const spy = jest.spyOn(wrapper.instance().onWindowResized, 'cancel');
        const spy2 = jest.spyOn(window, 'removeEventListener');
        wrapper.unmount();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalledWith('resize', onWindowResized);
    }));
    describe('should works for dotPosition', () => {
        ['left', 'right', 'top', 'bottom'].forEach((dotPosition: any) => {
            it(dotPosition, () => {
                const wrapper = mount(<Carousel dotPosition={dotPosition}>
            <div />
          </Carousel>);
                jest.runAllTimers();
                expect(wrapper.render()).toMatchSnapshot();
            });
        });
    });
    it('warning', () => {
        const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mount(<Carousel vertical>
        <div />
      </Carousel>);
        expect(warnSpy).toHaveBeenCalledWith('Warning: [antd: Carousel] `vertical` is deprecated, please use `dotPosition` instead.');
        warnSpy.mockRestore();
    });
    describe('should active when children change', () => {
        it('should active', () => {
            const wrapper = mount(<Carousel />);
            wrapper.setProps({
                children: <div />,
            });
            wrapper.update();
            expect(wrapper.find('.slick-active').length).toBeTruthy();
        });
        it('should keep initialSlide', () => {
            const wrapper = mount(<Carousel initialSlide={1}/>);
            wrapper.setProps({
                children: [<div key="1"/>, <div key="2"/>, <div key="3"/>],
            });
            wrapper.update();
            expect(wrapper
                .find('.slick-dots li')
                .at(1)
                .hasClass('slick-active')).toBeTruthy();
        });
    });
});
