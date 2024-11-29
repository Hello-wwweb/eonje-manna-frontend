import React from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css';
import { Button, Modal } from 'react-bootstrap';

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useCallback, useMemo, useState, useEffect } from 'react';
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

import Calendar from '../components/calendar/Calendar';
import axiosInstance from '../axiosInstance';

// 시간 선택하는 모달 띄우는 거
import TimeSelectionModal from './TimeSelectionModal';

function EventCalendarPage() {
    const { event_id } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

    const [eventDateSelections, setEventDateSelections] = useState([]);
    const [dateCounts, setDateCounts] = useState({});
    const [topDates, setTopDates] = useState([]);
    const [eventDate, setEventDate] = useState(null);

    const fetchEventDateSelections = useCallback(async (event_id) => {
        try {
            // date를 Date 객체로 변환
            const response = await axiosInstance.get('/event-date-selections/search', {
                params: { event: event_id },
            });

            setEventDateSelections(response.data);  // Store fetched selections in state
        } catch (error) {
            console.error('Error fetching event date selections:', error);
        }
    }, []);

    useEffect(() => {
        fetchEventDateSelections(event_id);

    }, [event_id]);

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
    }, [eventDateSelections]);

    useEffect(() => {
        if (Object.keys(dateCounts).length > 0) {
            const sortedDates = Object.entries(dateCounts)
                .sort((a, b) => b[1] - a[1]) // 선택 횟수를 기준으로 내림차순 정렬
                .slice(0, 5) // 상위 5개 날짜
                .map(entry => entry[0]); // 날짜만 추출

            setTopDates(sortedDates); // 상위 5개 날짜 업데이트
        }
    }, [dateCounts]);

    const handleDateConfirm = async () => {
        try {
            const response = await axiosInstance.patch(
                `/groups/${event_id}/events/${event_id}`,  // 여기에 해당하는 URL로 PATCH 요청
                {
                    event_date: eventDate,  // 선택된 날짜를 보내기
                }
            );
            console.log('Date updated successfully:', response.data);
            // 요청이 성공하면 모달 닫기
            setIsChangeModalOpen(false);
        } catch (error) {
            console.error('Error updating date:', error);
        }
    };



    const onDateClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedDate(null);
        setIsModalOpen(false);
    };

    const openChangeModal = () => {
        setIsChangeModalOpen(true); // 새로운 모달 열기
    };

    const closeChangeModal = () => {
        setIsChangeModalOpen(false);
    };

    return (
        <div className="container">
            <div className="calendarWrapper">
                <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} onDateClick={onDateClick} event_id={event_id}/>
            </div>
            <div className="selectedDates">
                <h1>약속 날짜</h1>
                {topDates.map((date, index) => (
                    <Button
                        key={index}
                        variant="primary"
                        onClick={() => {
                            setEventDate(date);
                            openChangeModal();  // 날짜 클릭 시 새로운 모달 열기
                        }}
                        style={{ margin: '5px' }}
                    >
                        {format(new Date(date), 'yyyy-MM-dd')}
                    </Button>
                ))}
            </div>
            {isModalOpen && (
                <TimeSelectionModal
                    event_id={event_id}
                    date={selectedDate}
                    onClose={closeModal}
                />
            )}
            {isChangeModalOpen && (
                <Modal
                    show={isChangeModalOpen}
                    onHide={closeChangeModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>이 날짜로 결정하시겠습니까?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{format(new Date(eventDate), 'yyyy-MM-dd')} 이 날짜를 선택하시겠습니까?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeChangeModal}>취소</Button>
                        <Button variant="primary" onClick={handleDateConfirm}>확인</Button>
                    </Modal.Footer>
                </Modal>
            )}   
        </div>
    );
}

export default EventCalendarPage;
