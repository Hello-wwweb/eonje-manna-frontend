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
                <h1>Selected Dates</h1>
                <p>{selectedDate ? format(selectedDate, "yyyy-MM-dd") : "No date selected"}</p>
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
