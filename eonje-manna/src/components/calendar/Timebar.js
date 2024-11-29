import React from 'react';
import PropTypes from 'prop-types';
import './Timebar.css';  // Assuming you have your CSS in the same folder

const TimeBar = ({ name, timeData, onTimeClick, timeType, disableClick  }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}`);

    const selectedTimes = (timeData && Array.isArray(timeData) ? timeData : []).map(time => time.split(":")[0]);

    const getClassName = (hour) => {
        if (selectedTimes.includes(hour)) {
            return "selected";  // Highlight selected times
        }
        if (timeType === 'unavailable') {
            return "unavailable";  // Available time slots (if passed)
        }
        if (timeType === 'result') {
            return "overlapping";  // Results display (if passed)
        }
        return "";
    };

    const handleClick = (hour) => {
        if (disableClick) {
            // Optionally show some feedback or prevent further action if `disableClick` is true
            return;
        }
        onTimeClick(hour);  // Proceed with the normal click behavior
    };

    return (
        <div className="time-bar">
            <div className="time-bar-name">{name}</div>
            {/* Time segments container */}
            <div className="time-segment-container">
                {hours.map((hour) => {
                    const className = getClassName(hour); // Get the class name for each hour

                    return (
                        <div
                            key={hour}
                            className={`time-segment ${className}`}  // Dynamically assigned class
                            title={hour}
                            onClick={() => handleClick(hour)}  // Pass the hour on click
                        >
                            <div className={`time-segment-bar ${className}`}></div>
                            <div className="time-segment-label">{hour}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

TimeBar.propTypes = {
    hours: PropTypes.array.isRequired,         // Array of hours (e.g., ["09", "10", "11", ..., "23"])
    timeData: PropTypes.array.isRequired,      // Array of people with available times
    onTimeClick: PropTypes.func.isRequired,    // Callback when a time segment is clicked
    timeType: PropTypes.oneOf(['selectable', 'unavailable', 'result']).isRequired,  // Type of time bar
};

export default TimeBar;
