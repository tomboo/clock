import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.ALARM}>Alarm</Link>
            </li>
            <li>
                <Link to={ROUTES.STOPWATCH}>Stopwatch</Link>
            </li>
            <li>
                <Link to={ROUTES.TIMER}>Timer</Link>
            </li>
            <li>
                <Link to={ROUTES.POMODORO}>Pomodoro</Link>
            </li>
            <li>
                <Link to={ROUTES.SETTINGS}>Settings</Link>
            </li>
        </ul>
    </div>
);

export default Navigation;