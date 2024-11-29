import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './TimeSelectionModal.css';
import { Modal, Button } from 'react-bootstrap';

import TimeBar from '../components/calendar/Timebar';
import TimeBarResult from '../components/calendar/TimebarResult';
import axiosInstance from '../axiosInstance';

function TimeSelectionModal({ event_id, date, onClose }) {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [eventDateSelections, setEventDateSelections] = useState([]);
    const [userNickname, setUserNickname] = useState("");
    const [userData, setUserData] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [eventDateSelectionId, setEventDateSelectionId] = useState(null);
    const [timeCounts, setTimeCounts] = useState({});


    const fetchEventDateSelections = async (event_id, date) => {
        try {
            // date를 Date 객체로 변환
            const dateObj = new Date(date);
            
            // year, month, day 추출
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;  // getMonth()는 0부터 시작하므로 1을 더해줘야 함
            const day = dateObj.getDate();
    
            // 쿼리 파라미터로 year, month, day를 전달
            const response = await axiosInstance.get('/event-date-selections/search', {
                params: { event:event_id, year, month, day },
            });

            setEventDateSelections(response.data);  // Store fetched selections in state
        } catch (error) {
            console.error('Error fetching event date selections:', error);
        }
    };

    const fetchEventDateSelectionsMemberId = async (event_id, member_id) => {
        try {
    
            const response = await axiosInstance.get('/event-date-selections/search', {
                params: { event:event_id, member:member_id },
            });

            setEventDateSelectionId(response.data[0].id);  // Store fetched selections in state
        } catch (error) {
            console.error('Error fetching event date selections:', error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await axiosInstance.get('/profile/');
            const user = response.data;
            setMemberId(user.member_id); // Assuming the response contains the member_id
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const filterUserData = (eventDateSelections, memberId) => {
        return eventDateSelections.filter((selection) => selection.member === memberId);
    };

    useEffect(() => {
        fetchEventDateSelections(event_id, date); // Fetch event date selections
        fetchUserProfile(); // Fetch user profile data

    }, [event_id, date]);

    useEffect(() => {
        // Ensure that memberId is available before fetching event date selections for that member

        fetchEventDateSelectionsMemberId(event_id, memberId);
        
    }, [memberId, event_id, eventDateSelections]);

    useEffect(() => {
        if (memberId && eventDateSelections.length > 0) {
            const filteredData = filterUserData(eventDateSelections, memberId);
            setUserData(filteredData); // Store filtered user data

            // Update selectedTimes to store times grouped by date
            const updatedSelectedTimes = filteredData.reduce((timesAccumulator, data) => {
                const selectedDates = data.selected_dates;
                const selectedDate = Object.keys(selectedDates)[0];  // Get the first date
                const times = selectedDates[selectedDate];  // Get the times for that date
                
                // Combine and remove duplicates (if necessary)
                timesAccumulator = [...new Set([...timesAccumulator, ...times])];
                return timesAccumulator;
            }, []);
    
            setSelectedTimes(updatedSelectedTimes);
        }
        console.log("event", eventDateSelections);

        const counts = {};
        eventDateSelections.forEach(selection => {
            const selectedDates = selection.selected_dates;
            Object.values(selectedDates).flat().forEach(time => {
                const hour = time.split(':')[0];  // 시간만 추출
                counts[hour] = (counts[hour] || 0) + 1;  // 선택된 시간 카운트
            });
        });

        setTimeCounts(counts);

    }, [memberId, eventDateSelections]);

    

    const toggleTime = (time) => {
        const timeWithSuffix = `${time}:00`; // Append ":00" to the time
    
        if (selectedTimes.includes(timeWithSuffix)) {
            setSelectedTimes(selectedTimes.filter((t) => t !== timeWithSuffix)); // Remove time
        } else {
            setSelectedTimes([...selectedTimes, timeWithSuffix]); // Add time with ":00"
        }
    };

    const renderTimeBar = () => {
        console.log(selectedTimes);
        return (
            <TimeBar
                name="me"
                timeData={selectedTimes} // Times for the logged-in user
                onTimeClick={toggleTime}
                timeType="selectable"
            />
        );
    };

    const renderMemberTimes = () => {
        if (!eventDateSelections || eventDateSelections.length === 0) return null;

        return eventDateSelections
            .filter((data) => data.member !== memberId)  // Exclude logged-in user
            .map((data, index) => {
                console.log(data);
                const memberNickname = data.name;
                const selectedDates = data.selected_dates;

                if (!selectedDates || Object.keys(selectedDates).length === 0) return null;

                return (
                    <TimeBar
                        name={memberNickname}
                        timeData={Object.values(selectedDates).flat()}  // Times for the logged-in user
                        onTimeClick={toggleTime}
                        timeType="selectable"
                        disableClick={true}
                    />
                );
            });
    };

    const renderResult = () => {
        if (!eventDateSelections || eventDateSelections.length === 0) return null;

        console.log(timeCounts);  // timeCounts 확인

        // Step 2: Render TimeBarResult with different styles based on the count
        return (
            <TimeBarResult
                timeData={timeCounts}  // 계산된 timeCounts 전달
                totalMembers={eventDateSelections.length}  // 참여한 총 멤버 수
            />
        );
    };

    const handleSubmit = async (date) => {
        try {
            // Check if the selected times already exist for this event
            const formattedDate = format(new Date(date), 'yyyy-MM-dd');
            const selectedDates = {};

            if (!selectedTimes) {
                selectedDates[formattedDate] = [];  
            } else {
                selectedDates[formattedDate] = selectedTimes;
            }


            const data = {
                event: event_id,
                selected_dates: selectedDates,
            };
            console.log(data);

            if (eventDateSelectionId) {
                // If selection exists, send PATCH request
                await axiosInstance.patch(`/event-date-selections/${eventDateSelectionId}`, data);
                console.log('Updated event date selection');
            } else {
                // If no selection exists, send POST request
                await axiosInstance.post('/event-date-selections/', data);
                console.log('Created new event date selection');
            }

            onClose(); // Close the modal after submitting
        } catch (error) {
            console.error('Error submitting event date selections:', error);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Time for <br />{date ? format(date, "yyyy-MM-dd") : "No date selected"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderTimeBar()} {/* Render the time selection component */}
                {renderMemberTimes()}
                {renderResult()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={() => handleSubmit(date)}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TimeSelectionModal;
