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


// Timer Component
// - Parent component
class Timer extends React.Component {
  constructor(props) {
    super(props);
    let sessionLength = 1;  // TODO: Add default session length to settings
    this.state = {
      timerState: STATE_INIT,
      sessionLength: sessionLength,
      timer: sessionLength * 60,       // time remaining
      timerID: 0,
      alarm: "Radar"
    };
    this.setSessionLength = this.setSessionLength.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  setSessionLength(e) {
    if (this.state.timerState !== STATE_INIT) return;

    let increment = 1;
    if (e.currentTarget.value === "-") {
      increment = -1;
    }

    let newLength = this.state.sessionLength + increment;
    if (0 < newLength && newLength <= 60) {
      this.setState({
        sessionLength: newLength,
        timer: newLength * 60
      });  
    }
  }

  startTimer() {
    return setInterval(() => this.handleInput(INPUT_TICK), 1000);
  }

  stopTimer(timerID) {
    if (timerID) {
      clearInterval(timerID);
    }
    return 0;
  }

  handleInput(input) {
    let timer = this.state.timer;
    let timerID = this.state.timerID;
    let timerState = this.state.timerState;

    switch (input) {
      case INPUT_CANCEL:
        timer = this.state.sessionLength * 60;
        timerID = this.stopTimer(timerID);
        timerState = STATE_INIT;
        break;
      case INPUT_START:
        timer = this.state.sessionLength * 60;
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
        timer = timer - 1;
        // TODO: switch to red timer when timer reaches n minutes
        if (timer <= 0) {
          timer = 0;
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
      timer: timer,
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
            length={this.state.sessionLength}
            onClick={this.setSessionLength}
          />
        {/* ) : ( */}
          <TimerClock
            sessionLength={this.state.sessionLength}
            timer={this.state.timer}
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
// - props.length
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
        <div>{this.props.length}</div>
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
// - props.sessionLength (minutes)
// - props.timer (seconds)
//
// - Clock face
// - TODO: Format time remaining (min:sec)
// - TODO: End time
// - TODO: Progress indicator
class TimerClock extends React.Component {
  render() {
    let length = this.props.sessionLength * 60;
    let progress = (length - this.props.timer) / length;
    return (
      <div>
        <h3>Timer Clock</h3>
        <p>props.sessionLength: {this.props.sessionLength}</p>
        <p>props.timer: {this.props.timer}</p>
        <p>progress: {progress}</p>
        <p>End Time: 9:00 AM</p>
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
