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
      alarm: "Radar"
    };
    this.reset = this.reset.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);
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
        sessionLength: newLength
      });  
    }
  }

  handleInput(input) {
    let nextState = null;
    switch (input) {
      case INPUT_CANCEL:
        // clearInterval
        nextState = STATE_INIT;
        break;
      case INPUT_START:
        // setInterval
        nextState = STATE_RUN;
        break;
      case INPUT_PAUSE:
        // clearInterval
        nextState = STATE_PAUSE;
        break;
      case INPUT_RESUME:
        // setInterval
        nextState = STATE_RUN;
        break;
      case INPUT_DONE:
        // clearInterval
        nextState = STATE_FINISH;
        break;
      default:
        // clearInterval
        nextState = STATE_INIT;
        break;
    };

    this.setState({
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
        { isStateInit ? (
          <TimerLengthControl
            title="Session Length"
            length={this.state.sessionLength}
            onClick={this.setSessionLength} />
        ) : (
          <TimerClock sessionLength={this.state.sessionLength} />
        )}

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
// - Clock face
// - Time remaining
// - End time
// - Progress indicator (time remaining / sessionLength)
class TimerClock extends React.Component {
  render() {
    return (
      <div>
        <h3>Timer Clock</h3>
        <p>sessionLength: {this.props.sessionLength}</p>
        <p>Time Remaining: 25:00</p>
        <p>End Time: 9:00 AM</p>
        <p>Progress: Time Remaining / sessionLength</p>
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
