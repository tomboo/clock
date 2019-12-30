import React from 'react';
import CircularProgressBar from '../CircularProgressBar';
import Button from '../Button';

const STATE_INIT    = 'initial';
const STATE_RUN     = 'run';
const STATE_PAUSE   = 'pause';

const INTERVAL = 1000;      // update interval (1 sec)

// TimerPage Component
export default class TimerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerState: STATE_INIT,
            timerID: 0,

            // current interval
            duration: 10000,        // session length (mSec)
            remaining: 0,       // remaining time (mSec)
            start: 0,           // started session (mSec - epoch time)
            end: 0,             // session ending (mSec - epoch time)
        };

        this.onCancel = this.onCancel.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onResume = this.onResume.bind(this);
     }

    onCancel() {
        this.stopTimer();
        this.setState({
            remaining: 0,
            start: 0,
            end: 0,
        });
        this.setState({timerState: STATE_INIT});
    }

    onStart() {
        const now = Date.now();
        const duration = this.state.duration;

        this.startTimer();
        this.setState({
            remaining: duration,
            start: now,
            end: now + duration,
        });    
        this.setState({timerState: STATE_RUN});
    }
    
    onPause() {
        this.stopTimer();
        this.setState({timerState: STATE_PAUSE});
    }
    
    onResume() {
        const now = Date.now();
        const remaining = this.state.remaining;
  
        this.startTimer();
        this.setState({
          end: now + remaining
        })
        this.setState({timerState: STATE_RUN});
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
        const now = Date.now();
        const remaining = Math.max(0, this.state.end - now);

        if (remaining === this.state.remaining) {
          return;   // no change
        }
        this.setState({remaining: remaining});
    
        /*
        // on update remaining time
        this.tickWarn(remaining);
        this.tickAlarm(remaining);
        this.tickPhase(remaining);
        */
        if (remaining === 0) {
            this.stopTimer();
            this.setState({timerState: STATE_INIT});

            console.log('*** Play Audio ***');
        }
    }

    render() {
        const { timerState, duration, remaining } = this.state;
        const value = duration ? Math.floor(remaining / duration * 100) : 0;

        return (
            <div>
                <h1>TimerPage</h1>
                <span>
                    <CircularProgressBar
                        value={value}
                    />
                </span>
                <span>
                    <Button onClick={() => this.onCancel()}>
                        Cancel
                    </Button>

                    { timerState === STATE_INIT && 
                        <Button onClick={() => this.onStart()}>
                            Start
                        </Button>
                    }
                    { timerState === STATE_RUN && 
                        <Button onClick={() => this.onPause()}>
                            Pause
                        </Button>
                    }
                    { timerState === STATE_PAUSE && 
                        <Button onClick={() => this.onResume()}>
                            Resume
                        </Button>
                    }
                </span>
            </div>    
        );
    };
}
