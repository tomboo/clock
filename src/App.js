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


// Formatting routines
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


const INTERVAL = fromSec(1);      // update interval

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

    // STATE:
    this.state = {
      timerState: STATE_INIT,   // timer state
      timerID: 0,               // update timer ID

      phase: [
        { name: 'Session',  length: fromMin(25), },
        { name: 'Break',    length: fromMin(5), },
      ],
      phaseIndex: 0,
           
      // current phase
      duration: fromMin(25),    // session length (mSec)
      elapsed: 0,               // elapsed time (mSec)
      remaining: 0,             // remaining time (mSec)
      start: 0,                 // started session (mSec - epoch time)
      end: 0,                   // session ending (mSec - epoch time)

      alarm: "Radar",
    };

    // BINDINGS:
    this.phaseInit = this.phaseInit.bind(this);
    this.setLength = this.setLength.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  //Lifecycle Methods
  componentDidMount() {
    this.phaseInit(0);
  }

  phaseInit(index) {
    const duration = this.state.phase[index].length;
    const now = Date.now();

    this.setState({
      phaseIndex: index,
      duration: duration,
      elapsed: 0,
      remaining: duration,
      start: now,
      end: now,
    });
  }

  // Event Handlers
  // Handle click on IntegerControl increment/decrement buttons
  setLength(phaseIndex, increment) {
    if (this.state.timerState !== STATE_INIT) return;

    let newLength = toMin(this.state.phase[phaseIndex].length) + increment;
    if (0 < newLength && newLength <= 60) {
      newLength = fromMin(newLength);

      let phaseCopy = this.state.phase.slice();   // create clone of phase array
      phaseCopy[phaseIndex].length = newLength;
      this.setState({
        phase: phaseCopy
      });
      if (phaseIndex === 0) {
        this.setState({
          duration: newLength,
          remaining: newLength  
        });
      }
    }  
  }

  startTimer() {
    const timerState = this.state.timerState;
    const duration = this.state.duration;
    const now = Date.now();

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

    return setInterval(() => this.handleInput(INPUT_TICK), INTERVAL);
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
            <IntegerControl
              title={this.state.phase[0].name}
              value={this.state.phase[0].length}
              increment={() => this.setLength(0, 1)}
              decrement={() => this.setLength(0, -1)}
            />
          </div>
          <div className="col-auto">
            <IntegerControl
              title={this.state.phase[1].name}
              value={this.state.phase[1].length}
              increment={() => this.setLength(1, 1)}
              decrement={() => this.setLength(1, -1)}
            />
          </div>
        </div>
        <hr />

        {/* Clock Face */}
        <div className="row justify-content-center">
          <div className="col-auto">
            <TimerClock
              timerState={this.state.timerState}
              title={this.state.phase[this.state.phaseIndex].name}
              duration={this.state.duration}
              remaining={this.state.remaining}
              start={this.state.start}
              end={this.state.end}
            />
          </div>
        </div>
        <hr />

        {/* Timer Controls */}
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


// IntegerControl Component
// - props.title
// - props.value
// - props.increment
// - props.decrement
class IntegerControl extends React.Component {
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
              onClick={this.props.decrement}
              value="-">
                <i className="fa fa-arrow-down"/>
            </button>

            <button className="btn btn-primary">
              {toMin(this.props.value)}
            </button>

            <button className="btn btn-secondary"
              onClick={this.props.increment}
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
// - props.title
// - props.duration
// - props.remaining
// - props.start
// - props.end
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
            <h4 className="text-primary">{this.props.title}</h4>
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
            Paused: {clockify(this.props.end - this.props.start - this.props.duration)}
          </div>
          <div className="row justify-content-start">
            Started {this.props.title}: {toDate(this.props.start)}
          </div>
          <div className="row justify-content-start">
            {this.props.title} Ending: {toDate(this.props.end)}
          </div>
          <div className="row justify-content-start">
            Timer State: {this.props.timerState}
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
// - props.value (percentage)
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
  strokeWidth: 10,
  value: 0,
  text: ''
};
