import React, { useState } from 'react';
import { format } from 'date-fns';
import './TimeSelectionModal.css';

function TimeSelectionModal({ date, onClose }) {
    // 더미 데이터
    const availableTimes = {
        name: "Alice",
        time: ["09", "10", "11", "15", "16"],
    };

    
    // 사용자가 선택한 시간들
    const [selectedTimes, setSelectedTimes] = useState([]);

    // 24시간 목록
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}`);

    // 시간 선택
    const toggleTime = (time) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter((t) => t !== time)); // 선택 해제
        } else {
            setSelectedTimes([...selectedTimes, time]); // 선택 추가
        }
    };

    // 시간 바 컴포넌트
    const renderSelectableTimeBar = () => (
        <div className="time-bar my-time-bar">
            <div className="time-bar-name">User name</div>
            {hours.map((hour) => (
                <div
                    key={hour}
                    className={`time-segment ${selectedTimes.includes(hour) ? "selected" : ""}`}
                    onClick={() => toggleTime(hour)} // 클릭 가능
                    title={hour} // 툴팁
                >
                    <div className={`time-segment-bar ${selectedTimes.includes(hour) ? "selected" : ""}`}></div>
                    <div className="time-segment-label">{hour}</div>
                </div>
            ))}
        </div>
    );
    const renderUnavailableTimeBar = () => (
        <div className="time-bar">
            <div className="time-bar-name">{availableTimes.name}</div>
            {hours.map((hour) => (
                <div
                    key={hour}
                    className={`time-segment ${availableTimes.time.includes(hour) ? "available" : ""}`}
                    title={hour} // 툴팁
                >
                    <div className={`time-segment-bar ${availableTimes.time.includes(hour) ? "available" : ""}`}></div>
                    <div className="time-segment-label">{hour}</div>
                </div>
            ))}
        </div>
    );

    const resultTimeBar = () => (
        <div className="time-bar result-time-bar">
            <div className="time-bar-name">Result</div>
            {hours.map((hour) => (
                <div
                    key={hour}
                    className={`time-segment ${availableTimes.time.includes(hour) ? "available" : ""}`}
                    title={hour} // 툴팁
                >
                    <div className={`time-segment-bar ${["01", "03", "10"].includes(hour) ? "available" : ""}`}></div>
                    <div className="time-segment-label">{hour}</div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="modalBackdrop">
            <div className="modalContent">
                {/* 날짜가 있을 때만 포맷팅 */}
                <h2>Select Time for <br />{date ? format(date, "yyyy-MM-dd") : "No date selected"}</h2>
                {renderSelectableTimeBar()}
                {renderUnavailableTimeBar()}
                {renderUnavailableTimeBar()}
                {resultTimeBar()}

                <div className="btnContainer">
                    <button onClick={onClose} className="closeBtn">
                        Close
                    </button>
                    <button onClick={onClose} className="submitBtn">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TimeSelectionModal;
