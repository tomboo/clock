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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Clock
        </h1>
        <ul>
          <li><a className="App-link" href="#">Alarm</a></li>
          <li><a className="App-link" href="#">Stopwatch</a></li>
          <li><a className="App-link" href="#">Timer</a></li>
        </ul>
      </header>

      <div>
        <Timer duration="25" alarm="Radar"/>
      </div>
    </div>
  );
}

export default App;


class Timer extends React.Component {
  render() {
    return (
      <div>
        <h2>Timer</h2>
        <TimerDuration duration={this.props.duration}/>
        <TimerClock duration={this.props.duration} />
        <TimerControl />
        <TimerAlarm alarm={this.props.alarm} />
      </div>
    );
  }
}

class TimerDuration extends React.Component {
  render() {
    return (
      <div>
        <h3>Timer Duration</h3>
        <p>{this.props.duration}</p>
        <p>0 hours - 25 minutes - 0 seconds</p>
      </div>
    );
  }
}

class TimerClock extends React.Component {
  render() {
    return (
      <div>
        <h3>Timer Clock</h3>
        <p>{this.props.duration}</p>
        <p>Time Remaining: 25:00</p>
        <p>End Time: 9:00 AM</p>
        <p>Progress: Time Remaining / Timer Duration</p>
      </div>
    );
  }
}

class TimerControl extends React.Component {
  render() {
    return (
      <div>
        <h3>Timer Control</h3>
        <button>Cancel</button>
        <button>Start/Pause/Resume</button>
      </div>
    );
  }
}

class TimerAlarm extends React.Component {
  render() {
    return (
      <div>
        <h3>Timer Alarm</h3>
        <p>{this.props.alarm}</p>
        <p>When Timer Ends</p>
        <p>List of Alarm Sounds</p>
      </div>
    );
  }
}
