import React from 'react';
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lolex from 'lolex';
import Timecode from 'react-timecode';
import Timer from './index';

Enzyme.configure({
  adapter: new Adapter(),
});

let component;

const clock = lolex.install({
  loopLimit: 100000,
});

beforeEach(() => {
  clock.reset();
});

afterAll(() => {
  clock.uninstall();
});

describe('<Timer />', () => {
  test('render markup - default component', () => {
    component = mount(<Timer />, {
      attachTo: document.getElementById('root'),
    });

    expect(component.html()).toBe('<div></div>');
    component.unmount();
  });

  test('render markup - custom component', () => {
    component = mount(<Timer component="section" />, {
      attachTo: document.getElementById('root'),
    });

    expect(component.html()).toBe('<section></section>');

    component.unmount();
  });

  test('render child - Timecode', () => {
    component = mount((
      <Timer>
        <Timecode />
      </Timer>
    ), {
      attachTo: document.getElementById('root'),
    });

    expect(component.html()).toBe('<div><span>0:00</span></div>');
    component.unmount();
  });

  test('render child - Timecode w/ time', () => {
    component = mount((
      <Timer time={1000}>
        <Timecode />
      </Timer>
    ), {
      attachTo: document.getElementById('root'),
    });

    expect(component.html()).toBe('<div><span>0:01</span></div>');
    component.unmount();
  })

  test('onStart - called', () => {
    const onStart = jest.fn();

    component = mount(<Timer active onStart={onStart} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toBeCalled();

    component.unmount();
  });

  test('onStart - not called', () => {
    const onStart = jest.fn();

    component = mount(<Timer onStart={onStart} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).not.toBeCalled();

    component.unmount();
  });

  test('onStart - called twice when loop enabled', () => {
    expect.assertions(2);

    const onStart = jest.fn();

    component = mount(<Timer active duration={100} loop onStart={onStart} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toHaveBeenCalledTimes(1);
    clock.tick(115);
    expect(onStart).toHaveBeenCalledTimes(2);

    component.unmount();
  });

  test('onStart - called when no duration', () => {
    const onStart = jest.fn();

    component = mount(<Timer active duration={null} onStart={onStart} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toHaveBeenCalledWith({
      duration: null,
      progress: 0,
      time: 0,
    });

    component.unmount();
  });

  test('onFinish - called', () => {
    expect.assertions(2);

    const onFinish = jest.fn();

    component = mount(<Timer active duration={100} onFinish={onFinish} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onFinish).not.toBeCalled();
    clock.tick(112);
    expect(onFinish).toBeCalled();

    component.unmount();
  });

  test('onFinish - not called', () => {
    expect.assertions(2);

    const onFinish = jest.fn();

    component = mount(<Timer duration={100} onFinish={onFinish} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onFinish).not.toBeCalled();
    clock.tick(100);
    expect(onFinish).not.toBeCalled();

    component.unmount();
  });

  test('onTimeUpdate - called', () => {
    expect.assertions(2);

    const onTimeUpdate = jest.fn();

    component = mount(<Timer active duration={100} onTimeUpdate={onTimeUpdate} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onTimeUpdate).not.toBeCalled();
    clock.tick(115);
    expect(onTimeUpdate).toHaveBeenLastCalledWith({
      duration: 100,
      progress: 1,
      time: 112,
    });

    component.unmount();
  });

  test('onTimeUpdate - called with no duration', () => {
    expect.assertions(2);

    const onTimeUpdate = jest.fn();

    component = mount(<Timer active duration={null} onTimeUpdate={onTimeUpdate} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onTimeUpdate).not.toBeCalled();
    clock.tick(96);
    expect(onTimeUpdate).toHaveBeenLastCalledWith({
      duration: null,
      progress: 0,
      time: 96,
    });

    component.unmount();
  });

  test('onStop - called', () => {
    expect.assertions(2);

    const onStop = jest.fn();

    component = mount(<Timer active onStop={onStop} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onStop).not.toBeCalled();
    component.setProps({ active: false });
    expect(onStop).toBeCalled();

    component.unmount();
  });

  test('time offset supported - onStart', () => {
    const onStart = jest.fn();

    component = mount(<Timer active duration={100} time={50} onStart={onStart} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toHaveBeenCalledWith({
      duration: 100,
      progress: 0.5,
      time: 50,
    });

    component.unmount();
  });

  test('time offset supported - onTimeUpdate', () => {
    expect.assertions(3);

    const onStart = jest.fn();
    const onTimeUpdate = jest.fn();

    component = mount((
      <Timer
        active
        duration={160}
        time={80}
        onStart={onStart}
        onTimeUpdate={onTimeUpdate}
      />
    ), {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toHaveBeenCalledWith({
      duration: 160,
      progress: 0.5,
      time: 80,
    });

    expect(onTimeUpdate).not.toBeCalled();
    clock.tick(48);
    expect(onTimeUpdate).toHaveBeenCalledWith({
      duration: 160,
      progress: 0.8,
      time: 128,
    });

    component.unmount();
  });

  test('time prop changed', () => {
    expect.assertions(2);
    const onTimeUpdate = jest.fn();

    component = mount(<Timer active onTimeUpdate={onTimeUpdate} />, {
      attachTo: document.getElementById('root'),
    });

    clock.tick(16);
    expect(onTimeUpdate).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0.0016,
      time: 16,
    });
    component.setProps({ time: 5000 });
    clock.tick(16);
    expect(onTimeUpdate).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0.5016,
      time: 5016,
    });

    component.unmount();
  });

  test('active prop changed - after timer complete', () => {
    expect.assertions(4);

    const onStart = jest.fn();
    const onStop = jest.fn();
    const onTimeUpdate = jest.fn();

    component = mount((
      <Timer
        active
        onStart={onStart}
        onStop={onStop}
        onTimeUpdate={onTimeUpdate}
      />
    ), {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0,
      time: 0,
    });
    clock.tick(10000);
    expect(onTimeUpdate).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 1,
      time: 10000,
    });
    component.setProps({ active: false });
    expect(onStop).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 1,
      time: 10000,
    });
    component.setProps({ active: true });
    expect(onStart).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0,
      time: 0,
    });

    component.unmount();
  });

  test('active prop changed - before timer complete', () => {
    expect.assertions(4);

    const onStart = jest.fn();
    const onStop = jest.fn();
    const onTimeUpdate = jest.fn();

    component = mount((
      <Timer
        active
        onStart={onStart}
        onStop={onStop}
        onTimeUpdate={onTimeUpdate}
      />
    ), {
      attachTo: document.getElementById('root'),
    });

    expect(onStart).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0,
      time: 0,
    });
    clock.tick(2000);
    expect(onTimeUpdate).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0.2,
      time: 2000,
    });
    component.setProps({ active: false });
    expect(onStop).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0.2,
      time: 2000,
    });
    component.setProps({ active: true });
    expect(onStart).toHaveBeenLastCalledWith({
      duration: 10000,
      progress: 0.2,
      time: 2000,
    });

    component.unmount();
  });
});
