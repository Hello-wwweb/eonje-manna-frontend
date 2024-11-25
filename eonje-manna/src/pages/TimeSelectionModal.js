import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './TimeSelectionModal.css';

function TimeSelectionModal({ date, onClose }) {
    const availableTimesList = [
        { name: "Alice", time: ["09", "10", "11", "15", "16"] },
        { name: "Bob", time: ["09","10", "11", "12", "14", "15"] },
        { name: "Charlie", time: ["09", "13", "14", "16"] },
    ];

    const [selectedTimes, setSelectedTimes] = useState([]);

    // 결과 시간 막대바 만들기 위한 결과시간 State
    const [resultTimes, setResultTimes] = useState([]);

    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}`);

    const toggleTime = (time) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter((t) => t !== time)); // 선택 해제
        } else {
            setSelectedTimes([...selectedTimes, time]); // 선택 추가
        }
    };

    // 결과 시간을 위한 시간 교집합 구하기
    //overlapping : 교집합 시간 넣을 배열
    //person : 각 사람에 대한 처리 하기 위해서
    // 
    
    const getResult = () => {
        return availableTimesList.reduce((overlapping, person, index) => {
            const personOverlap = selectedTimes.filter((time) =>
                person.time.includes(time)
            );

            if (index === 0) {
                return personOverlap;
            } //첫번째 사람을 공통시간으로 초기화

            return overlapping.filter((time) => personOverlap.includes(time));
        }, selectedTimes); // 초기값을 selectedTimes로 설정
    };

    useEffect(() => {
        setResultTimes(getResult());
    }, [selectedTimes]);

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
        availableTimesList.map((person, index) => (
            <div className="time-bar" key={index}>
                <div className="time-bar-name">{person.name}</div>
                {hours.map((hour) => (
                    <div
                        key={hour}
                        className={`time-segment ${person.time.includes(hour) ? "available" : ""}`}
                        title={hour} // 툴팁
                    >
                        <div className={`time-segment-bar ${person.time.includes(hour) ? "available" : ""}`}></div>
                        <div className="time-segment-label">{hour}</div>
                    </div>
                ))}
            </div>
        ))
    );

    const resultTimeBar = () => {
        return (
            <div className="time-bar result-time-bar">
                <div className="time-bar-name">Result</div>
                {hours.map((hour) => (
                    <div
                        key={hour}
                        className={`time-segment ${resultTimes.includes(hour) ? "overlapping" : ""}`}
                        title={hour} // 툴팁
                    >
                        <div className={`time-segment-bar ${resultTimes.includes(hour) ? "overlapping" : ""}`}></div>
                        <div className="time-segment-label">{hour}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="modalBackdrop">
            <div className="modalContent">
                <div className="timeSelectionHead">
                    <h2>Select Time for <br />{date ? format(date, "yyyy-MM-dd") : "No date selected"}</h2>
                    <button onClick={onClose} className="closeBtn">
                        X
                    </button>
                </div>
                {renderSelectableTimeBar()}
                {renderUnavailableTimeBar()}
                {resultTimeBar()}

                <div className="btnContainer">
                    <button onClick={onClose} className="submitBtn">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TimeSelectionModal;
