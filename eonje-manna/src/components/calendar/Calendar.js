import React, { useCallback, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, differenceInCalendarDays, getMonth, isSaturday, isSunday } from 'date-fns';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import './Calendar.css';

const weekMock = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar({ currentDate, setCurrentDate, onDateClick }) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    // Handle month navigation
    const nextMonthHandler = useCallback(() => {
        setCurrentDate(addMonths(currentDate, 1));
    }, [currentDate, setCurrentDate]);

    const preMonthHandler = useCallback(() => {
        setCurrentDate(subMonths(currentDate, 1));
    }, [currentDate, setCurrentDate]);

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
                <button className="prevBtn" onClick={preMonthHandler}>
                    <HiChevronLeft />
                </button>
                <div className="month">
                    {format(currentDate, "MM")}
                </div>
                <button className="nextBtn" onClick={nextMonthHandler}>
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

                    if (validation && isSaturday(v)) {
                        style = { color: "blue" };
                    } else if (validation && isSunday(v)) {
                        style = { color: "red" };
                    }

                    return (
                        <div
                            key={`date${i}`}
                            className={validation ? "currentMonth" : "diffMonth"}
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