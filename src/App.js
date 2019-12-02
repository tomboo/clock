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


const STATE_INIT = 'initial';
const STATE_RUN = 'run';
const STATE_PAUSE = 'pause';
const STATE_FINISH = 'finish';   // sound alarm

const INPUT_CANCEL = 'cancel';
const INPUT_START = 'start';
const INPUT_PAUSE = 'pause';
const INPUT_RESUME = 'resume';
const INPUT_DONE = 'done';       // timer finished


// Timer Component
// - Parent component
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerState: STATE_INIT,
      sessionLength: 25,
      timer: 25 * 60,       // time remaining
      intervalID: 0,
      alarm: "Radar"
    };
    this.reset = this.reset.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);
    this.tick = this.tick.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  reset() {
    this.setState({
      timerState: STATE_INIT,
      sessionLength: 25
    });
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

  tick() {
    let newTimer = this.state.timer - 1;
    this.setState({
      timer: newTimer
    });
  }

  handleInput(input) {
    let timer = this.state.timer;
    let intervalID = this.state.intervalID;
    let nextState = null;

    switch (input) {
      case INPUT_CANCEL:
        timer = this.state.sessionLength * 60;
        if (intervalID) {
          clearInterval(intervalID);
        }
        intervalID = 0;
        nextState = STATE_INIT;
        break;
      case INPUT_START:
        timer = this.state.sessionLength * 60;
        intervalID = setInterval(this.tick, 1000);
        nextState = STATE_RUN;
        break;
      case INPUT_PAUSE:
        if (this.state.intervalID) {
          clearInterval(this.state.intervalID);
        }
        intervalID = 0;
        nextState = STATE_PAUSE;
        break;
      case INPUT_RESUME:
        intervalID = setInterval(this.tick, 1000);
        nextState = STATE_RUN;
        break;
      case INPUT_DONE:
        nextState = STATE_FINISH;
        break;
      default:
        nextState = STATE_INIT;
        break;
    };

    this.setState({
      timer: timer,
      intervalID: intervalID,
      timerState: nextState
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
      case STATE_FINISH:
        buttonLabel = 'Start';
        buttonAction = INPUT_START;
        break;
      default:
        buttonLabel = 'ERROR';
        buttonAction = INPUT_START;
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
