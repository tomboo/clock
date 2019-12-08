// React (https://reactjs.org/)
// Guide to Main Concepts (https://reactjs.org/docs/hello-world.html)
// Main Concepts
// 12. Thinking in React (https://reactjs.org/docs/thinking-in-react.html)
//
// [X] Step 1: Break The UI Into A Component Hierarchy
// [X] Step 2: Build A Static Version in React
// [ ] Step 3: Identify The Minimal (but complete) Representation Of UI State
// [ ] Step 4: Identify Where Your State Should Live
// [ ] Step 5: Add Inverse Data Flow

/** NOTES:
/** Dependencies are React, ReactDOM, and 
    Accurate_Interval.js by Squuege (external script 
    to keep setInterval() from drifting over time & 
    thus ensuring timer goes off at correct mark).
/** Utilizes embedded <Audio> tag to ensure audio 
    plays when timer tab is inactive or browser is 
    minimized ( rather than new Audio().play() ).
/** Audio of this fashion not supported on most 
    mobile devices it would seem (bummer I know).
**/

// TODO: Switch from setInterval to Accurate_Interval

import React from 'react';
import './App.css';

// App Component
function App() {
  return (
    <div className="App">
      <div>
        <Timer />
      </div>
    </div>
  );
}

export default App;

// TODO: Review State Design Pattern

const STATE_INIT    = 'initial';
const STATE_RUN     = 'run';
const STATE_PAUSE   = 'pause';

const INPUT_CANCEL  = 'cancel';
const INPUT_START   = 'start';
const INPUT_PAUSE   = 'pause';
const INPUT_RESUME  = 'resume';
const INPUT_TICK    = 'tick';

function toSec(ms) {
  return Math.floor(ms / 1000);
}
function toMin(ms) {
  return Math.floor(ms / (60 * 1000));
}
function fromSec(s) {
  return s * 1000;
}
function fromMin(m) {
  return m * 60 * 1000; 
}
function clockify(ms) {
  let minutes = toMin(ms);
  let seconds = toSec(ms) - minutes * 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return minutes + ':' + seconds;
}
function toPercent(n, d) {
  return Math.floor(n / d * 100) + '%';
}
function toDate(ms) {
  let date = new Date(ms);
  return date.toLocaleTimeString();
}


// Timer Component
// - Parent component
class Timer extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Add duration and interval to settings
    let duration = fromMin(1); // TODO: Set default duration to 25 mins
    let interval = fromSec(1);

    // STATE:
    this.state = {
      timerState: STATE_INIT,   // timer state
      timerID: 0,               // update timer ID

      interval: interval,       // update interval (mSec)
      duration: duration,       // session length (mSec)
      elapsed: 0,               // elapsed time (mSec)
      remaining: duration,      // remaining time (mSec)

      start: 0,                 // started session (mSec - epoch time)
      end: 0,                   // session ending (mSec - epoch time)

      alarm: "Radar",
    };

    // BINDINGS:
    this.setSessionLength = this.setSessionLength.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  setSessionLength(e) {
    if (this.state.timerState !== STATE_INIT) return;

    let increment = 1;
    if (e.currentTarget.value === "-") {
      increment = -increment;
    }

    let newLength = toMin(this.state.duration) + increment;
    if (0 < newLength && newLength <= 60) {
      this.setState({
        duration: fromMin(newLength),
        remaining: fromMin(newLength)
      });  
    }
  }

  startTimer() {
    let timerState = this.state.timerState;
    let duration = this.state.duration;
    let now = Date.now();

    if (timerState === STATE_INIT) {
      this.setState({
        elapsed: 0,
        remaining: duration,
        start: now,
        end: now + duration
      });
    }
    else if (timerState === STATE_PAUSE) {
      this.setState({
        end: now + this.state.remaining
      });
    }
    else {
      console.log('ERROR');  // TODO: assert
    }

    return setInterval(() => this.handleInput(INPUT_TICK), this.state.interval);
  }

  stopTimer(timerID) {
    if (timerID) {
      clearInterval(timerID);
    }
    return 0;
  }

  handleInput(input) {
    let remaining = this.state.remaining;
    let timerID = this.state.timerID;
    let timerState = this.state.timerState;

    switch (input) {
      case INPUT_CANCEL:
        remaining = this.state.duration;
        timerID = this.stopTimer(timerID);
        timerState = STATE_INIT;
        break;
      case INPUT_START:
        remaining = this.state.duration;
        timerID = this.startTimer();
        timerState = STATE_RUN;
        break;
      case INPUT_PAUSE:
        timerID = this.stopTimer(timerID);
        timerState = STATE_PAUSE;
        break;
      case INPUT_RESUME:
        timerID = this.startTimer();
        timerState = STATE_RUN;
        break;
      case INPUT_TICK:
        remaining = this.state.end - Date.now();
        // TODO: switch to red timer when remaining reaches n minutes
        if (remaining <= 0) {
          remaining = 0;
          timerID = this.stopTimer(timerID);
          timerState = STATE_INIT;

          // TODO: Timer should display zero before sounding alarm
          // TODO: Sound alarm
          console.log('*** SOUND ALARM ***');
        }
        break;
      default:
        timerState = STATE_INIT;
        break;
    };

    this.setState({
      remaining: remaining,
      timerID: timerID,
      timerState: timerState
    });
  }

  render() {
    return (
      <div className="container">

        {/* Title */}
        <div className="row justify-content-center">
          <div className="col-auto">
            <h2 className="text-primary">Pomodoro Timer</h2>
          </div>
        </div>
        <hr />

        {/* Timer Length Controls */}
        <div className="row justify-content-center">
          <div className="col-auto">
            <TimerLengthControl
              title="Session Length"
              duration={this.state.duration}
              onClick={this.setSessionLength}
            />
          </div>
          <div className="col-auto">
            <TimerLengthControl
              title="Break Length"
              duration="5"
              onClick={this.setSessionLength}
            />
          </div>
        </div>
        <hr />

        {/* Clock Face */}
        <div className="row justify-content-center">
          <div className="col-auto">
            <TimerClock
              timerState={this.state.timerState}
              duration={this.state.duration}
              remaining={this.state.remaining}
              start={this.state.start}
              end={this.state.end}
            />
          </div>
        </div>
        <hr />

        {/* Clock Face */}
        <div className="row justify-content-center">
          <div className="col-auto"> 
            <TimerControl
              timerState={this.state.timerState}
              onClick={input => this.handleInput(input)}
            />
          </div>
        </div>
        <hr />

        {/* Alarm Control */}
        <div className="row justify-content-center">
          <div className="col-auto"> 
            <TimerAlarm alarm={this.state.alarm} />
          </div>
        </div>
        <hr />
      </div>
    );
  }
}


// TimerLengthControl Component
// - props.title
// - props.duration
// - props.onClick
class TimerLengthControl extends React.Component {
  // TODO: Disable buttons when not STATE_INIT
  render() {
    return (
      <div> 
        <div className="row justify-content-center">
          <div className="col-auto">
            <h4 className="text-primary">{this.props.title}</h4>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-auto">
            <button className="btn btn-secondary"
              onClick={this.props.onClick}
              value="-">
                <i className="fa fa-arrow-down"/>
            </button>

            <button className="btn btn-primary">
              {toMin(this.props.duration)}
            </button>

            <button className="btn btn-secondary"
              onClick={this.props.onClick}
              value="+">
                <i className="fa fa-arrow-up"/>
            </button>
          </div>
        </div>
      </div>  
    )
  }
}

// TimerClock Component - Clock face
// - props.timerState
// - props.duration
// - props.remaining
// - props.start
// - props.end
//
// - Clock face
// - TODO: Format time remaining (min:sec)
// - TODO: End time
// - TODO: Progress indicator
class TimerClock extends React.Component {
  render() {
    const duration = this.props.duration;
    const remaining = this.props.remaining;
    const elapsed = duration - remaining;
    
    return (
      <div className="row justify-content-center">
        <div className="col-auto">
          <div className="row justify-content-center">
            <div className="col-auto">
              <CircularProgressBar
                    strokeWidth="10"
                    sqSize="200"
                    value={Math.floor(remaining / duration * 100)}
                    text={clockify(remaining)}
              />
            </div>
          </div>
        </div>
        <div className="col-auto">
          <div className="row justify-content-center">
            <h4 className="text-primary">Session</h4>
          </div>
          <div className="row justify-content-start">
            Duration: {clockify(duration)}
          </div>
          <div className="row justify-content-start">
            Elapsed: {clockify(elapsed)} ({toPercent(elapsed, duration)})
          </div>
          <div className="row justify-content-start">
            Remaining: {clockify(remaining)} ({toPercent(remaining, duration)})
          </div>
          <div className="row justify-content-start">
            Started Session: {toDate(this.props.start)}
          </div>
          <div className="row justify-content-start">
            Session Ending: {toDate(this.props.end)}
          </div>
       </div>
      </div>
    );
  }
}

// TimerControl Component
// - Cancel Button
// - Start/Pause/Resume Button
// Properties:
// - props.timerState
// - props.onClick
class TimerControl extends React.Component {
  render() {
    const timerState = this.props.timerState;
    const disabled = (timerState === STATE_INIT);

    let buttonLabel = null;
    let buttonAction = null;

    switch (timerState){
      case STATE_INIT:
        buttonLabel = 'Start';
        buttonAction = INPUT_START;
        break;
      case STATE_RUN:
        buttonLabel = 'Pause';
        buttonAction = INPUT_PAUSE;
        break;
      case STATE_PAUSE:
        buttonLabel = 'Resume';
        buttonAction = INPUT_RESUME;
        break;
      default:
        buttonLabel = 'ERROR';
        buttonAction = INPUT_CANCEL;
        break;
    };

    return (
      <div>
        <div className="row justify-content-center">
          <div className="col-auto">
            <button className="btn btn-danger"
              onClick={() => this.props.onClick(INPUT_CANCEL)}
              disabled={disabled}>
                Cancel
            </button>
            <button className="btn btn-primary"
              onClick={() => this.props.onClick(buttonAction)}>
                {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// TimerAlarm Component
// - Pick alarm sound
class TimerAlarm extends React.Component {
  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-auto">
          <label htmlFor="alarm">When Timer Ends</label>
          <button id="alarm" className="btn btn-secondary">{this.props.alarm} ></button>
        </div>
      </div>
    
    );
  }
}


/*
  <div>
    <input 
      id="progressInput" 
      type="range" 
      min="0" 
      max="100" 
      step="1"
      value={this.state.percentage}
      onChange={this.handleChangeEvent}/>
  </div>
*/
 
// CircularProgressBar Component
// - props.sqSize
// - props.strokeWidth
// - props.value: percentage
// - props.text: optional text (default to value + '%')
//
class CircularProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.value / 100;

    const text = this.props.text ? this.props.text : this.props.value + '%';

    return (
      <svg
          width={this.props.sqSize}
          height={this.props.sqSize}
          viewBox={viewBox}>
          <circle
            className="circle-background"
            cx={this.props.sqSize / 2}
            cy={this.props.sqSize / 2}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`} />
          <circle
            className="circle-progress"
            cx={this.props.sqSize / 2}
            cy={this.props.sqSize / 2}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`}
            // Start progress marker at 12 O'Clock
            transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
            style={{
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset
            }} />
          <text
            className="circle-text"
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle">
            {`${this.props.text}`}
          </text>
      </svg>
    );
  }
}

CircularProgressBar.defaultProps = {
  sqSize: 200,
  percentage: 0,
  strokeWidth: 10
};
