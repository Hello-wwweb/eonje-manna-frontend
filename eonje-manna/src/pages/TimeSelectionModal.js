import React, { useState } from 'react';
import { format } from 'date-fns';
import './TimeSelectionModal.css';

function TimeSelectionModal({ date, onClose }) {
    const [selectedTime, setSelectedTime] = useState([]);

    // 시간 클릭 핸들러
    const toggleTime = (time) => {
        setSelectedTime((prev) =>
            prev.includes(time)
                ? prev.filter((t) => t !== time) // 선택 해제
                : [...prev, time] // 선택 추가
        );
    };

    const times = Array.from({ length: 24 }, (_, i) => `${i}:00`); // 시간 배열

    return (
        <div className="modalBackdrop">
            <div className="modalContent">
                {/* 날짜가 있을 때만 포맷팅 */}
                <h2>Select Time for <br/>{date ? format(date, "yyyy-MM-dd") : "No date selected"}</h2>
                <div className="timeOptions">
                    {times.map((time) => (
                        <div
                            key={time}
                            className={`timeOption ${selectedTime.includes(time) ? "selected" : ""}`}
                            onClick={() => toggleTime(time)}
                        >
                            {time}
                        </div>
                    ))}
                </div>
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
