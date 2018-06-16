import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanProps from 'clean-react-props';

class TimerWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: props.duration,
      startTime: props.active ? Date.now() - props.time : null,
      time: props.time,
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    const {
      duration,
      startTime,
      time,
    } = this.state;

    const {
      active,
      onStart,
    } = this.props;

    if (active) {
      const progress = Math.max(0, Math.min(1, time / duration));

      onStart({
        duration,
        progress: this.getProgress(time),
        time,
      });

      this.animationFrame = requestAnimationFrame(this.tick);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      active,
      duration,
      time,
      onStart,
      onStop,
    } = nextProps;

    if (time !== this.props.time) {
      this.setState({
        time,
      });
    }

    if (active !== this.props.active) {
      switch (active) {
        case true:
          const nextTime = duration !== null && this.state.time >= duration
            ? 0
            : this.state.time;

          this.setState({
            startTime: Date.now() - nextTime,
            time: nextTime,
          });

          onStart({
            duration,
            progress: this.getProgress(nextTime),
            time: nextTime,
          });

          this.animationFrame = requestAnimationFrame(this.tick);
          break;

        case false:
          cancelAnimationFrame(this.animationFrame);

          onStop({
            duration,
            progress: this.getProgress(this.state.time),
            time: this.state.time,
          });
          break;
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
  }

  getProgress(time) {
    const {
      duration,
    } = this.state;

    if (!duration) {
      return null;
    }

    return Math.max(0, Math.min(1, time / duration));
  }

  tick() {
    const {
      duration,
      loop,
      time,
      onFinish,
      onTimeUpdate,
      onStart,
    } = this.props;

    const {
      startTime,
    } = this.state;

    let nextTime = Date.now() - startTime;

    onTimeUpdate({
      duration,
      progress: this.getProgress(nextTime),
      time: nextTime,
    });

    this.setState({
      time: nextTime,
    }, () => {
      if (duration !== null && nextTime >= duration) {
        onFinish({
          duration,
          progress: this.getProgress(nextTime),
          time: nextTime,
        });

        if (!loop) {
          cancelAnimationFrame(this.animationFrame);
          return;
        }

        nextTime = 0;
        onStart({
          duration,
          progress: 0,
          time: nextTime,
        });

        this.setState({
          startTime: Date.now(),
        });
      }

      this.animationFrame = requestAnimationFrame(this.tick);
    });
  }

  render() {
    const {
      children,
      component,
      duration,
    } = this.props;

    const {
      time,
    } = this.state;

    const progress = duration && time
      ? (time / duration)
      : 0;

    const clonedChildren = React.Children.toArray(children).map((child, childIndex) => {
      return React.cloneElement(child, {
        duration,
        time,
        progress,
      });
    });

    return React.createElement(component, {
        ...cleanProps(this.props),
      },
      clonedChildren
    );
  }
}

TimerWrapper.propTypes = {
  active: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  duration: PropTypes.number,
  loop: PropTypes.bool,
  time: PropTypes.number,
  onFinish: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onStart: PropTypes.func,
};

TimerWrapper.defaultProps = {
  active: false,
  component: 'div',
  duration: 10000,
  loop: false,
  time: 0,
  onFinish: () => {},
  onStart: () => {},
  onStop: () => {},
  onTimeUpdate: () => {},
};

export default TimerWrapper;
