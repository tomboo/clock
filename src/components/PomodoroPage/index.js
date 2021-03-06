import React from 'react';
import CircularProgressBar from '../CircularProgressBar'
import IntegerControl from '../IntegerControl'
import { clockify, fromSec, fromMin, toMin, toPercent, toDate } from '../../utilities'

const INTERVAL = fromSec(1);      // update interval

/* State Design Pattern
  */
const STATE_INIT    = 'initial';
const STATE_RUN     = 'run';
const STATE_PAUSE   = 'pause';

// Base class
//
class TimerState {
  constructor(name) {
    this.name = name;
  }

  // Override
  cancel(context) {
    context.reset();
  }

  renderButton(label, handleClick, disabled=false) {
    return(
      <button className="btn btn-primary mr-1" onClick={handleClick} disabled={disabled}>
        {label}
      </button>
    );
  }
}

// InitialState
//
class InitialState extends TimerState {
  constructor() {
    super(STATE_INIT);
  }

  // Override
  start(context) {
    const now = Date.now();
    const duration = context.state.duration;

    context.startTimer();
    context.setState({
      elapsed: 0,
      remaining: duration,
      start: now,
      end: now + duration,
    });
    context.setTimerState(new RunState());
  }

  renderButtons(context) {
    return (
      <div>
        {this.renderButton('Cancel', () => this.cancel(context), true)}
        {this.renderButton('Start', () => this.start(context))}
      </div>
    );
  }
}

// RunState
//
class RunState extends TimerState {
  constructor() {
    super(STATE_RUN);
  }

  // Override
  pause(context) {
    context.stopTimer();
    context.setTimerState(new PauseState());
  }

  renderButtons(context) {
    return (
      <div>
        {this.renderButton('Cancel', () => this.cancel(context))}
        {this.renderButton('Pause', () => this.pause(context))}
      </div>
    );
  }
}

// PauseState
//
class PauseState extends TimerState {
    constructor() {
        super(STATE_PAUSE);
  }

  // Override
  resume(context) {
    const now = Date.now();

    context.startTimer();
    context.setState({
      end: now + context.state.remaining
    })
    context.setTimerState(new RunState());
  }

  renderButtons(context) {
    return (
      <div>
        {this.renderButton('Cancel', () => this.cancel(context))}
        {this.renderButton('Resume', () => this.resume(context))}
      </div>
    );
  }
}


// Timer Component
// - Parent component
export default
class PomodoroPage extends React.Component {
  constructor(props) {
    super(props);

    // STATE:
    this.state = {
      timerState: new InitialState(),   // timer state
      timerID: 0,               // update timer ID

      phase: [
        { name: 'Session',  length: fromMin(25), },
        { name: 'Break',    length: fromMin(5), },
      ],
      phaseIndex: 0,
            
      // current phase
      duration: fromMin(1),     // session length (mSec)
      elapsed: 0,               // elapsed time (mSec)
      remaining: 0,             // remaining time (mSec)
      start: 0,                 // started session (mSec - epoch time)
      end: 0,                   // session ending (mSec - epoch time)

      alarm: "Radar",
    };

    // BINDINGS: (required for functions that are passed to other components)
    this.setLength = this.setLength.bind(this);
  }

  //Lifecycle Methods
  componentDidMount() {
    this.reset();
  }

  reset() {
    this.stopTimer();
    this.setPhase(0);
    this.setTimerState(new InitialState());

    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  setTimerState(state) {
    this.setState({
      timerState: state
    });
  }

  setPhase(index) {
    const duration = this.state.phase[index].length;

    this.setState({
      phaseIndex: index,
      duration: duration,
      elapsed: 0,
      remaining: duration,
      start: 0,
      end: 0,
    });
  }

  // Event Handlers

  // Handle click on IntegerControl increment/decrement buttons
  setLength(phaseIndex, increment) {
    if (this.state.timerState.name !== STATE_INIT) return;

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
    let timerID = this.state.timerID;
    if (!timerID) {
      timerID = setInterval(() => this.tick(), INTERVAL);
      this.setState({
        timerID: timerID
      });
    }
  }

  stopTimer() {
    let timerID = this.state.timerID;
    if (timerID) {
      clearInterval(timerID);
      this.setState({
        timerID: 0
      });
    }
  }

  tick() {
    // update remaining time
    const remaining = Math.max(0, this.state.end - Date.now());
    if (remaining === this.state.remaining) {
      return;   // no change
    }
    this.setState({remaining: remaining});

    // on update remaining time
    this.tickWarn(remaining);
    this.tickAlarm(remaining);
    this.tickPhase(remaining);
  }

  tickWarn(remaining) {
    // TODO: switch to red timer when remaining reaches n minutes
  }

  tickAlarm(remaining) {
    if (remaining) return;

    // sound alarm
    this.stopTimer();
    this.setTimerState(new InitialState());

    // TODO: Timer should display zero before sounding alarm
    console.log('*** PLAY AUDIO ***');
    this.audioBeep.play();
  }

  tickPhase(remaining) {
    if (remaining) return;
    if (this.state.phase.length <= 1) return;

    // change phase
    const phaseIndex = (this.state.phaseIndex + 1) % this.state.phase.length;
    this.setPhase(phaseIndex)
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

        {/* Settings: Phase Length Controls */}
        <div className="row justify-content-center">
          <div className="col-auto">
            <IntegerControl
              title={`${this.state.phase[0].name} Length`}
              value={this.state.phase[0].length}
              increment={() => this.setLength(0, 1)}
              decrement={() => this.setLength(0, -1)}
            />
          </div>
          <div className="col-auto">
            <IntegerControl
              title={`${this.state.phase[1].name} Length`}
              value={this.state.phase[1].length}
              increment={() => this.setLength(1, 1)}
              decrement={() => this.setLength(1, -1)}
            />
          </div>
        </div>
        <hr />

        {/* Timer: Clock Face */}
        <div className="row justify-content-center">
          <div className="col-auto">
            <TimerClock
              timerState={this.state.timerState.name}
              title={this.state.phase[this.state.phaseIndex].name}
              duration={this.state.duration}
              remaining={this.state.remaining}
              start={this.state.start}
              end={this.state.end}
            />
          </div>
        </div>
        <hr />

        {/* Timer: Controls */}
        <div className="row justify-content-center">
          <div className="col-auto"> 
            {this.state.timerState.renderButtons(this)}
          </div>
        </div>
        <hr />

        {/* Settings: Alarm Control */}
        <div className="row justify-content-center">
          <div className="col-auto"> 
            <TimerAlarm alarm={this.state.alarm} />
          </div>
        </div>

        <audio
          controls
          id="beep"
          preload="auto"
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }} />

        <hr />

      </div>
    );
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
    const paused = Math.max(0, this.props.end - this.props.start - duration);
    
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
            Timer State: {this.props.timerState}
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
            Paused: {clockify(paused)}
          </div>
  
          {/* Start and End Time */}
          {this.props.timerState !== STATE_INIT &&
            <div>
              <div className="row justify-content-start">
                Started {this.props.title}: {toDate(this.props.start)}
              </div>
              <div className="row justify-content-start">
                {this.props.title} Ending: {toDate(this.props.end)}
              </div>
            </div>
          }
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
          <button id="alarm" className="btn btn-primary ml-1">{this.props.alarm} ></button>
        </div>
      </div>    
    );
  }
}
