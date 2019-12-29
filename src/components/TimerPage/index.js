import React from 'react';
import CircularProgressBar from '../CircularProgressBar';
import Button from '../Button';

export default class TimerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerState: 'initial'
        };

        this.onCancel = this.onCancel.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onResume = this.onResume.bind(this);
     }

    onCancel() {
        console.log('Cancel');
        this.setState({timerState: 'initial'});
    }

    onStart() {
        console.log('Start');
        this.setState({timerState: 'run'});
    }
    
    onPause() {
        console.log('Pause');
        this.setState({timerState: 'pause'});
    }
    
    onResume() {
        console.log('Resume');
        this.setState({timerState: 'run'});
    }

    render() {
        const { timerState } = this.state;
        return (
            <div>
                <h1>TimerPage</h1>
                <span>
                    <CircularProgressBar text='05:00'/>
                </span>
                <span>
                    <Button onClick={() => this.onCancel()}>
                        Cancel
                    </Button>

                    { timerState === 'initial' && 
                        <Button onClick={() => this.onStart()}>
                            Start
                        </Button>
                    }
                    { timerState === 'run' && 
                        <Button onClick={() => this.onPause()}>
                            Pause
                        </Button>
                    }
                    { timerState === 'pause' && 
                        <Button onClick={() => this.onResume()}>
                            Resume
                        </Button>
                    }
                </span>
            </div>    
        );
    };
}
