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
// import './App.css';

// App Component
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Clock</h1>
        <hr />
        <ul>
          <li><a className="App-link" href="#">Alarm</a></li>
          <li><a className="App-link" href="#">Stopwatch</a></li>
          <li><a className="App-link" href="#">Timer</a></li>
        </ul>
        <hr />
      </header>

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
      remaining: duration,      // remaining time (mSec)
      end: 0,                   // end time (mSec - epoch time)

      alarm: "Radar"
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
        remaining: duration,
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
    const isStateInit = (this.state.timerState === STATE_INIT);

    return (
      <div>
        <h2>Timer</h2>
        <p>timerState: {this.state.timerState}</p>

        {/* Conditional Rendering */}
        {/* { isStateInit ? ( */}
          <TimerLengthControl
            title="Session Length"
            duration={this.state.duration}
            onClick={this.setSessionLength}
          />
        {/* ) : ( */}
          <TimerClock
            duration={this.state.duration}
            remaining={this.state.remaining}
            end={this.state.end}
          />
        {/* )} */}

        <TimerControl
          timerState={this.state.timerState}
          onClick={input => this.handleInput(input)}
        />

        <TimerAlarm alarm={this.state.alarm} />
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
        <h3>{this.props.title}</h3>
        <button
          onClick={this.props.onClick}
          value="-">
            -
        </button>
        <div>{toMin(this.props.duration)} minutes</div>
        <button
          onClick={this.props.onClick}
          value="+">
            +
        </button>
      </div>  
    )
  }
}

// TimerClock Component
// - props.duration
// - props.remaining
// - props.end
//
// - Clock face
// - TODO: Format time remaining (min:sec)
// - TODO: End time
// - TODO: Progress indicator
class TimerClock extends React.Component {
  render() {
    const end = new Date(this.props.end);
    const progress = (this.props.duration - this.props.remaining) / this.props.duration;
    return (
      <div>
        <h3>Timer Clock</h3>
        <p>props.duration: {clockify(this.props.duration)}</p>
        <p>props.remaining: {clockify(this.props.remaining)}</p>
        <p>end: {end.toLocaleTimeString()}</p>
        <p>progress: {Math.floor(progress * 100)}%</p>
     </div>
    );
  }
}

// TimerControl Component
// - Cancel
// - Start/Pause/Resume
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
        <h3>Timer Control</h3>
        <p>timerState: {timerState}</p>
        <button
          onClick={() => this.props.onClick(INPUT_CANCEL)}
          disabled={disabled}>
            Cancel
        </button>
        <button
          onClick={() => this.props.onClick(buttonAction)}>
            {buttonLabel}
        </button>
      </div>
    );
  }
}

// TimerAlarm Component
// - Pick alarm sound
class TimerAlarm extends React.Component {
  render() {
    return (
      <div>
        <h3>Timer Alarm</h3>
        <p>alarm: {this.props.alarm}</p>
        <p>When Timer Ends</p>
        <p>List of Alarm Sounds</p>
      </div>
    );
  }
}
