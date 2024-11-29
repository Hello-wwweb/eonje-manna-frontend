import React from 'react';
import PropTypes from 'prop-types';
import './Timebar.css';

const TimeBarResult = ({ timeData, totalMembers }) => {
    // Determine the color based on how many members selected the time
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}`);
    const className = "selected";  // Highlight selected times

    const getClassName = (count) => {
        if (count >= totalMembers) {
            return 'best'; // All members selected this time
        } else if (count > 0) {
            return 'available'; // Some members selected this time
        } else {
            return 'default'; // No members selected this time
        }
    };

    return (
        <div className="time-bar">
            <div className="time-bar-name">result</div>
            {/* Time segments container */}
            <div className="time-segment-container">
                {hours.map((hour) => {
                    const count = timeData[hour] || 0; // Get the count for the hour, default to 0 if not selected
                    const className = getClassName(count);  // Determine the color based on the count

                    return (
                        <div
                            key={hour}
                            className={`time-segment ${className}`}  // Dynamically assigned class
                            title={hour}
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

TimeBarResult.propTypes = {
    timeData: PropTypes.object.isRequired,    // The time slot (e.g., "03:00")
    totalMembers: PropTypes.number.isRequired, // Total number of members
};

export default TimeBarResult;
