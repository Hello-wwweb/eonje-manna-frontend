import React from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css'

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useCallback, useMemo, useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    differenceInCalendarDays,
    getMonth,
    isSaturday,
    isSunday,
} from "date-fns";

import Calendar from "../components/calendar/Calendar";

// 시간 선택하는 모달 띄우는 거
import TimeSelectionModal from "./TimeSelectionModal";

function EventDetailPage() {
    const { event_id } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

<<<<<<< HEAD
=======
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const weekMock = ["일", "월", "화", "수", "목", "금", "토"]
    const nextMonthHandler = useCallback(()=>{
        setCurrentDate(addMonths(currentDate, 1));
    }, [currentDate]);
    const preMonthHandler = useCallback(()=>{
        setCurrentDate(subMonths(currentDate, 1));
    }, [currentDate]);
    const createMonth = useMemo(()=>{
        const monthArray = [];
        let day = startDate;
        while(differenceInCalendarDays(endDate, day)>=0){
            monthArray.push(day)
            day = addDays(day, 1);
        }
        return monthArray;
    },[startDate, endDate]);

    //날짜가 클릭됐을 때 모달 열기
>>>>>>> f546c294520e2912ca3f88b6aed8fefd01ba89d0
    const onDateClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedDate(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="calendarWrapper">
                <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} onDateClick={onDateClick} />
            </div>
            <div className="selectedDates">
                <h1>정해진 날짜</h1>
                <p>{selectedDate ? format(selectedDate, "yyyy-MM-dd") : "날짜가 선택되지 않았습니다"}</p>
            </div>
            {isModalOpen && (
                <TimeSelectionModal
                    event_id={event_id}
                    date={selectedDate}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default EventDetailPage;
