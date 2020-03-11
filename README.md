# ⏳ react-timer-wrapper

![npm](https://img.shields.io/npm/v/react-timer-wrapper?style=flat-square)
![NPM](https://img.shields.io/npm/l/react-timer-wrapper?style=flat-square)
![npm](https://img.shields.io/npm/dt/react-timer-wrapper?style=flat-square)
![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/react-timer-wrapper?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/react-timer-wrapper?style=flat-square)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/ryanhefner/react-timer-wrapper?style=flat-square)


Composable React Timer component that passes status props to children, in addition
to some basic callbacks. Can be used at a countdown timer ⏲ or as stopwatch ⏱ to track
time while active.

## Install

Via [npm](https://npmjs.com/package/react-timer-wrapper)

```sh
npm install --save react-timer-wrapper
```

Via [Yarn](https://yarn.fyi/react-timer-wrapper)

```sh
yarn add react-timer-wrapper
```

## How to use

The `Timer` can be used in a couple different ways. You could use it as a standalone
timer and setup callbacks to trigger things to happen in your project. Or, wrap
child components in `Timer` component, where those children will receive
props passed in by the `Timer`.

It can be used as a countdown timer, which will fire the `onFinish` event upon
completion. Or, you can use it to track the time that occurs while it’s active.

### Properties

* `active:Boolean` - Start/stop the timer. (Default: `false`)
* `component:String | Element` - Element or React component used to render/wrap the children. (Default: `div`)
* `duration:Number` - Enables countdown mode and is the number of milliseconds to count before firing `onFinish`. (Default: `10000`)
* `loop:Boolean` - Enable looping of the countdown timer. (Default: `false`)
* `time:Number` - Either used as a time offset for the duration when used as a countdown timer, or the initial time to start from when used for tracking time. (Default: `0`)
* `onFinish:Function` - Callback fired when the timer has finished. (Fired in countdown mode only)
* `onStart:Function` - Callback fired when the timer is started.
* `onStop:Function` - Callback fired when the timer is stopped.
* `onTimeUpdate:Function` - Callback fired when time updates.

### Examples

#### Standalone

```js
import Timer from 'react-timer-wrapper';

...

  onTimerStart({duration, progress, time}) {

  }

  onTimerStop({duration, progress, time}) {

  }

  onTimerTimeUpdate({duration, progress, time}) {

  }

  onTimerFinish({duration, progress, time}) {

  }

  render() {
    const {
      timerActive,
    } = this.state;

    return (
      <Timer
        active={timerActive}
        onFinish={this.onTimerFinish}
        onStart={this.onTimerStart}
        onStop={this.onTimerStop}
        onTimeUpdate={this.onTimerTimeUpdate}
      />
    );
  }

...

```

#### With children

```js
import Timer from 'react-timer-wrapper';
import CircleIndicator from 'react-indicators';

...

  render() {
    const {
      timerShouldRun,
    } = this.state;

    return (
      <Timer active={timerShouldRun}>
        <CircleIndicator />
      </Timer>
    );
  }

...

```

### Children

The `Timer` allows you to easily compose components that provide a visual
status of the timer. Each children receives the following props that you can use
to communicate the status of the timer.

* `duration:Number` - Duration of the countdown timer. _(Available for countdown timers only, `null` passed when used for time tracking)_
* `progress:Number` - Current percentage of timer complete. _(Available for countdown timers only, `null` passed when used for time tracking)_
* `time:Number` - Current time on the timer in milliseconds.

## Pairs well with...

* [react-indicators](https://github.com/ryanhefner/react-indicators)
* [react-timecode](https://github.com/ryanhefner/react-timecode)

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
