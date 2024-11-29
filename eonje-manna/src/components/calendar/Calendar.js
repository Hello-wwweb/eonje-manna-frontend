import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, differenceInCalendarDays, getMonth, isSaturday, isSunday } from 'date-fns';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import './Calendar.css';
import axiosInstance from '../../axiosInstance';

const weekMock = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar({ currentDate, setCurrentDate, onDateClick, event_id }) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const [eventDateSelections, setEventDateSelections] = useState([]);
    const [dateCounts, setDateCounts] = useState({});

    const totalMembers = () => {
        return eventDateSelections.length;
    };

    const fetchEventDateSelections = useCallback(async (event_id, date) => {
        try {
            // date를 Date 객체로 변환
            const dateObj = new Date(date);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // 0-based month, so add 1

            const response = await axiosInstance.get('/event-date-selections/search', {
                params: { event: event_id, year, month },
            });

            setEventDateSelections(response.data);  // Store fetched selections in state
        } catch (error) {
            console.error('Error fetching event date selections:', error);
        }
    }, []);

    // month가 변경될 때마다 해당 월의 이벤트 선택 정보를 불러오기
    useEffect(() => {
        fetchEventDateSelections(event_id, currentDate); // Fetch new data whenever the currentDate changes
    }, [currentDate, event_id, fetchEventDateSelections]);

    const getClassName = (date) => {
        // Get the count of selections for the specific date
        const count = dateCounts[format(date, "yyyy-MM-dd")] || 0;
        if (totalMembers() == 0) {
            return "default";
        }
        if (count >= totalMembers()) {
            return 'best'; // All members selected this time
        } else if (count > 0) {
            return 'available'; // Some members selected this time
        } else {
            return 'default'; // No members selected this time
        }
    };

    useEffect(() => {
        const counts = {};
        eventDateSelections.forEach(selection => {
            const selectedDates = selection.selected_dates;
            Object.keys(selectedDates).forEach(date => {
                const dateKey = format(new Date(date), 'yyyy-MM-dd');
                counts[dateKey] = (counts[dateKey] || 0) + 1;
            });
        });
        setDateCounts(counts); // Update counts

        console.log(counts);
    }, [eventDateSelections, currentDate]);

    // Handle month navigation
    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1)); // Go to the previous month
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1)); // Go to the next month
    };

    // Generate the month grid
    const createMonth = useMemo(() => {
        const monthArray = [];
        let day = startDate;
        while (differenceInCalendarDays(endDate, day) >= 0) {
            monthArray.push(day);
            day = addDays(day, 1);
        }
        return monthArray;
    }, [startDate, endDate]);

    return (
        <div className="calendar">
            <div className="year">
                {format(currentDate, "yyyy")}
            </div>
            <div className="monthContainer">
                <button className="prevBtn" onClick={handlePrevMonth}>
                    <HiChevronLeft />
                </button>
                <div className="month">
                    {format(currentDate, "MM")}
                </div>
                <button className="nextBtn" onClick={handleNextMonth }>
                    <HiChevronRight />
                </button>
            </div>
            <div className="dayContainer">
                {weekMock.map((v, i) => {
                    let style;
                    if (i === 0) {
                        style = { color: "red" };
                    } else if (i === 6) {
                        style = { color: "blue" };
                    }
                    return (
                        <div key={`day${i}`} style={style}>
                            {v}
                        </div>
                    );
                })}
            </div>
            <div className="dateContainer">
                {createMonth.map((v, i) => {
                    let style;
                    const validation = getMonth(currentDate) === getMonth(v);
                    const today = format(new Date(), "yyyyMMdd") === format(v, "yyyyMMdd");
                    const className = getClassName(v);

                    if (validation && isSaturday(v)) {
                        style = { color: "blue" };
                    } else if (validation && isSunday(v)) {
                        style = { color: "red" };
                    }

                    return (
                        <div
                            key={`date${i}`}
                            className={`day ${className} ${getMonth(currentDate) == getMonth(v) ? 'currentMonth' : 'diffMonth'}`}
                            onClick={() => onDateClick(v)}
                            style={style}
                        >
                            <div className="topLine">
                                <span className="day">
                                    {format(v, "dd")}
                                </span>
                                {today && <span className="todayMark"> (today)</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;