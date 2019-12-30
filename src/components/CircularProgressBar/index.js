import React from 'react';
import './index.css'
 
// CircularProgressBar Component
// - props.sqSize
// - props.strokeWidth
// - props.value (percentage)
// - props.text: optional text (default to value + '%')
//
class CircularProgressBar extends React.Component {
  render() {
    const {
      sqSize,         // size of enclosing square
      strokeWidth,
      value,          // percentage (0..100)
      text,           // optional text (default value + '%')
    } = this.props;

    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (sqSize - strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * value / 100;

    const circleText = text ? text : value + '%';

    return (
      <svg
        width={sqSize}
        height={sqSize}
        viewBox={viewBox}>
        <circle
          className="circle-background"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`} />
        <circle
          className="circle-progress"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
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
            {circleText}
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

export default CircularProgressBar;
