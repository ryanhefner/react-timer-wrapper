import React, { Component } from 'react';
import { DateTime } from 'luxon';
import HashHandler from 'react-hash-handler';
import { CircleIndicator } from 'react-indicators';
import TargetScroller from 'react-target-scroller';
import Timecode from 'react-timecode';
import Timer from 'react-timer-wrapper';
import ScrollTrigger from 'react-scroll-trigger';
import './App.css';

const DAY = 1000 * 60 * 60 * 24;
const NAV_ITEMS = [
  {
    label: 'Examples',
    target: '#examples',
  },
  {
    label: 'Docs',
    target: '#docs',
  },
  {
    label: 'Install',
    target: '#install',
  },
  {
    label: 'Credits',
    target: '#credits',
  },
  {
    label: 'License',
    target: '#license',
  },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSection: '#examples',
      activeTimers: {
        loop: false,
        timecode: false,
      },
      dates: this.getClockDates(),
      scrollTarget: null,
      timerProgress: {
        loop: {
          progress: 0.3
        },
      },
    };

    this.onHashChange = this.onHashChange.bind(this);
    this.onHashClick = this.onHashClick.bind(this);
  }

  getClockDates() {
    return {
      berlin: DateTime.fromObject({zone: 'Europe/Berlin'}),
      melbourne: DateTime.fromObject({zone: 'Australia/Melbourne'}),
      newYork: DateTime.fromObject({zone: 'America/New_York'}),
    };
  }

  onHashChange({hash}, evt) {
    const target = document.querySelector(`#${hash}`);

    if (target) {
      evt.preventDefault();

      this.setState({
        scrollTarget: `#${hash}`,
      });
    }
  }

  onHashClick({hash}, evt) {
    const target = document.querySelector(`#${hash}`);

    if (target) {
      evt.preventDefault();

      this.setState({
        scrollTarget: `#${hash}`,
      });
    }
  }

  onTimerUpdate(instance, data) {
    const {
      timerProgress,
    } = this.state;

    this.setState({
      timerProgress: Object.assign({}, timerProgress, {
        [instance]: data,
      }),
    });
  }

  onTimerFinish(instance) {
    if (instance === 'clocks') {
      this.setState({
        dates: this.getClockDates(),
      });
    }
  }

  onScrollTriggerEnterViewport(instance) {
    const {
      activeTimers,
    } = this.state;

    this.setState({
      activeTimers: Object.assign({}, activeTimers, {
        [instance]: true,
      }),
    });
  }

  onScrollTriggerExitViewport(instance) {
    const {
      activeTimers,
    } = this.state;

    this.setState({
      activeTimers: Object.assign({}, activeTimers, {
        [instance]: false,
      }),
    });
  }

  renderNavItems() {
    return NAV_ITEMS.map((item, index) => (
      <li className="nav-item" key={`nav-item-${index}`}>
        <a href={item.target} className="nav-link">{item.label}</a>
      </li>
    ));
  }

  render() {
    const {
      activeTimers,
      dates,
      scrollTarget,
      timerProgress,
    } = this.state;

    const date = new Date();
    const nextDayNewYork = DateTime.fromObject({zone: 'America/New_York'}).endOf('day');
    const nextDayMelbourne = DateTime.fromObject({zone: 'Australia/Melbourne'}).endOf('day');
    const nextDayBerlin = DateTime.fromObject({zone: 'Europe/Berlin'}).endOf('day');

    return (
      <div className="App">
        <HashHandler onChange={this.onHashChange} onClick={this.onHashClick} />
        <TargetScroller offset={64} target={scrollTarget} />
        <header className="site-header">
          <nav className="site-header-nav">
            <ul className="nav-list">
              {this.renderNavItems()}
            </ul>
          </nav>
          <div className="site-header-ctas">
            <a className="github-button" href="https://github.com/ryanhefner/react-timer-wrapper" data-icon="octicon-star" data-size="large" aria-label="Star ryanhefner/react-timer-wrapper on GitHub">Star</a>
            <a className="github-button" href="https://github.com/ryanhefner" data-size="large" aria-label="Follow @ryanhefner on GitHub">Follow @ryanhefner</a>
          </div>
        </header>
        <article className="page-wrapper">
          <header className="page-header">
            <h1 className="page-header-title">react-timer-wrapper</h1>
            <h2 className="page-header-subtitle">Composable React Timer component that passes its status to its children.</h2>
            <div className="page-header-ctas">
              <a className="github-button" href="https://github.com/ryanhefner/react-timer-wrapper" data-icon="octicon-star" data-size="large" aria-label="Star ryanhefner/react-timer-wrapper on GitHub">Star</a>
              <a className="github-button" href="https://github.com/ryanhefner" data-size="large" aria-label="Follow @ryanhefner on GitHub">Follow @ryanhefner</a>
            </div>
          </header>
          <section className="section section-examples" id="examples">
            <div className="content">
              <h3>Examples</h3>
            </div>
            <div className="example example-timecode">
              <div className="content">
                <h4>Timer w/ Timecode</h4>
                <ScrollTrigger
                  className="example-blocks"
                  onEnter={this.onScrollTriggerEnterViewport.bind(this, 'timecode')}
                  onExit={this.onScrollTriggerExitViewport.bind(this, 'timecode')}
                >
                  <Timer
                    active={activeTimers.timecode}
                    duration={null}
                  >
                    <Timecode className="timecode" component="p" />
                  </Timer>
                </ScrollTrigger>
                <pre>
                  <code>
                    {`
import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';

...

render() {
  return (
    <Timer active duration={null}>
      <Timecode />
    </Timer>
  );
}
                    `}
                  </code>
                </pre>
              </div>
            </div>
            <div className="example example-standalone">
              <div className="content">
                <h4>Timer - standalone</h4>
              </div>
              <ScrollTrigger
                className="example-blocks"
                onEnter={this.onScrollTriggerEnterViewport.bind(this, 'loop')}
                onExit={this.onScrollTriggerExitViewport.bind(this, 'loop')}
              >
                <Timer
                  active={activeTimers.loop}
                  loop
                  onTimeUpdate={this.onTimerUpdate.bind(this, 'loop')}
                />
                <div className="percent-wrapper" data-percent={`${Math.round(timerProgress.loop.progress * 100)}%`}>
                  <p className="percent">{`${Math.round(timerProgress.loop.progress * 100)}%`}</p>
                  <div className="percent-bar" style={{width: `${timerProgress.loop.progress * 100}%`}} />
                  <p
                    className="percent white"
                    style={{
                      clipPath: `inset(0 ${(1 - timerProgress.loop.progress) * 100}% 0 0)`,
                      webkitClipPath: `inset(0 ${(1 - timerProgress.loop.progress) * 100}% 0 0)`,
                    }}
                  >
                    {`${Math.round(timerProgress.loop.progress * 100)}%`}
                  </p>
                </div>
              </ScrollTrigger>
              <div className="content">
                <pre>
                  <code>
                    {`
import Timer from 'react-timer-wrapper';

...

constructor(props) {
  super(props);

  this.state = {
    progress: 0,
  };

  this.onTimerUpdate = this.onTimerUpdate.bind(this);
}

onTimerUpdate({progress}) {
  this.setState({
    progress,
  });
}

render() {
  return (
    <div>
      <Timer
        active
        loop
        onTimeUpdate={this.onTimerUpdate}
      />
      <p>{\`$\{Math.round(this.state.progress)}%\`}</p>
    </div>
  );
}
                    `}
                  </code>
                </pre>
              </div>
            </div>
            <div className="example example-indicators">
              <div className="content">
                <h4>Timer - Indicators</h4>
              </div>
              <ScrollTrigger
                className="example-blocks"
                onEnter={this.onScrollTriggerEnterViewport.bind(this, 'clocks')}
                onExit={this.onScrollTriggerExitViewport.bind(this, 'clocks')}
              >
                <Timer
                  active={activeTimers.clocks}
                  className="timezone"
                  duration={DAY}
                  loop
                  time={DAY - Math.abs(dates.berlin.diff(nextDayBerlin).valueOf())}
                  onFinish={this.onTimerFinish}
                >
                  <CircleIndicator
                    fill="#fff"
                    size={300}
                    stroke="#fff"
                    strokeBackground="transparent"
                  />
                  <h5>Berlin</h5>
                  <p className="location-time">{dates.berlin.toLocaleString(DateTime.TIME_24_SIMPLE)}</p>
                  <p className="location-date">{dates.berlin.toLocaleString(DateTime.DATE_MED)}</p>
                </Timer>
                <Timer
                  active={activeTimers.clocks}
                  className="timezone"
                  duration={DAY}
                  loop
                  time={DAY - Math.abs(dates.newYork.diff(nextDayNewYork).valueOf())}
                  onFinish={this.onTimerFinish}
                >
                  <CircleIndicator
                    fill="#fff"
                    size={300}
                    stroke="#fff"
                    strokeBackground="transparent"
                  />
                  <h5>New York</h5>
                  <p className="location-time">{dates.newYork.toLocaleString(DateTime.TIME_24_SIMPLE)}</p>
                  <p className="location-date">{dates.newYork.toLocaleString(DateTime.DATE_MED)}</p>
                </Timer>
                <Timer
                  active={activeTimers.clocks}
                  className="timezone"
                  duration={DAY}
                  loops
                  time={DAY - Math.abs(dates.melbourne.diff(nextDayMelbourne).valueOf())}
                  onFinish={this.onTimerFinish}
                >
                  <CircleIndicator
                    fill="#fff"
                    size={300}
                    stroke="#fff"
                    strokeBackground="transparent"
                  />
                  <h5>Melbourne</h5>
                  <p className="location-time">{dates.melbourne.toLocaleString(DateTime.TIME_24_SIMPLE)}</p>
                  <p className="location-date">{dates.melbourne.toLocaleString(DateTime.DATE_MED)}</p>
                </Timer>
              </ScrollTrigger>
              <div className="content">
                <pre>
                  <code>
                    {`
import Timer from 'react-timer-wrapper';
import { CircleIndicator } from 'react-indicators';

render() {
  return (
    <Timer
      active
      loop
    >
      <CircleIndicator
        fill="#fff"
        size={300}
        stroke="#fff"
        strokeBackground="transparent"
      />
    </Timer>
  );
}
                    `}
                  </code>
                </pre>
              </div>
            </div>
          </section>
          <section className="section section-docs" id="docs">
            <div className="content">
              <h3>Docs</h3>
              <div>
                <h4>Properties</h4>
                <ul>
                  <li><code>active:Boolean</code> - Start/stop the timer. (Default: <code>false</code>)</li>
                  <li><code>component:String | Element</code> - Element or React component used to render/wrap the children. (Default: <code>div</code>)</li>
                  <li><code>duration:Number</code> - Enables countdown mode and is the number of milliseconds to count before firing <code>onFinish</code>. (Default: <code>10000</code>)</li>
                  <li><code>loop:Boolean</code> - Enable looping of the countdown timer. (Default: <code>false</code>)</li>
                  <li><code>time:Number</code> - Either used as a time offset for the duration when used as a countdown timer, or the initial time to start from when used for tracking time. (Default: <code>0</code>)</li>
                  <li><code>onFinish:Function</code> - Callback fired when the timer has finished. (Fired in countdown mode only)</li>
                  <li><code>onStart:Function</code> - Callback fired when the timer is started.</li>
                  <li><code>onStop:Function</code> - Callback fired when the timer is stopped.</li>
                  <li><code>onTimeUpdate:Function</code> - Callback fired when time updates.</li>
                </ul>
              </div>
            </div>
          </section>
          <section className="section section-install" id="install">
            <div className="content">
              <h3>Install</h3>
              <p>Install via <a href="https://npmjs.com/package/react-timer-wrapper">npm</a>:</p>
              <pre>
                <code>
                  npm install --save react-timer-wrapper
                </code>
              </pre>
              <p>Or</p>
              <p>Install via <a href="https://yarn.fyi/react-timer-wrapper">Yarn</a>:</p>
              <pre>
                <code>
                  yarn add react-timer-wrapper
                </code>
              </pre>
            </div>
          </section>
          <section className="section section-credits" id="credits">
            <div className="content">
              <h3>Credits</h3>
              <h4>NPM Packages</h4>
              <ul className="credit-list">
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/luxon" rel="nofollow">luxon</a>
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/react-hash-handler">react-hash-handler</a><br />
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/react-indicators">react-indicators</a><br />
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/packcage/react-scroll-trigger">react-scroll-trigger</a><br />
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/react-target-scroller">react-target-scroller</a><br />
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/react-timecode">react-timecode</a><br />
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/react-timer-wrapper">react-timer-wrapper</a><br />
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://npmjs.com/package/tweenkle">tweenkle</a><br />
                  </p>
                </li>
              </ul>
              <h4>Fonts</h4>
              <ul className="credit-list">
                <li className="credit-item">
                  <p>
                    <a href="https://fonts.google.com/specimen/IBM+Plex+Sans" rel="nofollow">IBM Plex Sans</a>
                  </p>
                </li>
                <li className="credit-item">
                  <p>
                    <a href="https://fonts.google.com/specimen/IBM+Plex+Mono" rel="nofollow">IBM Plex Mono</a>
                  </p>
                </li>
              </ul>
            </div>
          </section>
          <section className="section section-license" id="license">
            <div className="content">
              <h3>MIT License</h3>
              <p>Copyright (c) 2017 - 2018 <a href="https://www.ryanhefner.com">Ryan Hefner</a></p>
              <p>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>
              <p>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </section>
        </article>
        <footer className="site-footer">
          <div className="content">
            <div className="follow-buttons">
              <a className="github-button" href="https://github.com/ryanhefner/react-timer-wrapper" data-icon="octicon-star" aria-label="Star ryanhefner/react-timer-wrapper on GitHub">Star</a>
              <a className="github-button" href="https://github.com/ryanhefner" aria-label="Follow @ryanhefner on GitHub">Follow @ryanhefner</a>
              <a className="twitter-follow-button" data-show-count="false" href="https://twitter.com/ryanhefner" aria-label="Follow @ryanhefner on Twitter">Follow @ryanhefner</a>
              <a className="twitter-follow-button" data-show-count="false" href="https://twitter.com/rockkick" aria-label="Follow @rockkick on Twitter">Follow @rockkick</a>
            </div>
            <p className="credits">Built by <a href="https://www.rockkick.co">Rock Kick Co.</a> and <a href="https://www.ryanhefner.com">Ryan Hefner</a>.</p>
            <p className="copyright">{`© 2017 - ${date.getFullYear()} Ryan Hefner`}</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
