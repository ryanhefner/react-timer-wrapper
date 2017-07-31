import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cleanProps from 'clean-react-props';

class TimerWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: props.duration,
      startTime: props.active ? Date.now() : null,
      time: props.time,
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    if (this.props.active) {
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
      let progress;

      switch (active) {
        case true:
          const nextTime = duration !== null && this.state.time >= duration
            ? 0
            : this.state.time;

          this.setState({
            startTime: Date.now() - nextTime,
            time: nextTime,
          });

          progress = duration !== null
            ? Math.max(0, Math.min(1, nextTime / duration))
            : null;

          onStart({
            duration,
            progress,
            time: nextTime,
          });

          this.animationFrame = requestAnimationFrame(this.tick);
          break;

        case false:
          cancelAnimationFrame(this.animationFrame);

          progress = Math.max(0, Math.min(1, this.state.time / duration));
          onStop({
            duration,
            progress,
            time: this.state.time,
          });
          break;
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
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


    const diff = Date.now() - startTime;
    let nextTime = this.props.time + diff;

    const progress = Math.max(0, Math.min(1, (nextTime / duration)));

    onTimeUpdate({
      duration,
      progress,
      time: nextTime,
    });

    this.setState({
      time: nextTime,
    });

    if (duration !== null && this.state.time >= duration) {
      onFinish({
        duration,
        progress,
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
  }

  render() {
    const {
      children,
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

    return (
      <div {...cleanProps(this.props)}>
        {clonedChildren}
      </div>
    );
  }
}

TimerWrapper.propTypes = {
  active: PropTypes.bool,
  duration: PropTypes.number,
  loop: PropTypes.bool,
  time: PropTypes.number,
  onFinish: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onStart: PropTypes.func,
};

TimerWrapper.defaultProps = {
  active: false,
  duration: 10000,
  loop: false,
  time: 0,
  onFinish: () => {},
  onStart: () => {},
  onStop: () => {},
  onTimeUpdate: () => {},
};

export default TimerWrapper;
