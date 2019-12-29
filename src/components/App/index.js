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

/*
import React from 'react';
import './index.css';
import CircularProgressBar from '../CircularProgressBar'

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
*/

import React from 'react';
import './index.css'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Navigation from '../Navigation';
import AlarmPage from '../AlarmPage';
import StopwatchPage from '../StopwatchPage';
import TimerPage from '../TimerPage';

import * as ROUTES from '../../constants/routes';

// App Component
const App = () => (
  <Router>
    <Navigation />
    <hr />

    {/*<Route exact path={ROUTES.LANDING} component={LandingPage} />*/}
    <Route path={ROUTES.ALARM} component={AlarmPage} />
    <Route path={ROUTES.STOPWATCH} component={StopwatchPage} />
    <Route path={ROUTES.TIMER} component={TimerPage} />
  </Router>
);

export default App;
