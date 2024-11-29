import "./DashboardPage.css"

import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import ScrollContainer from '../components/container/ScrollContainer';
import EventCard from '../components/card/EventCard';
import { useState, useEffect } from 'react';


function DashboardPage(){
    const { id } = useParams();

    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const fetchUserEvents = async () => {
        try {
            const response = await axiosInstance.get(`/groups/${id}/events`);
            setEvents(response.data); 
        } catch (err) {
            console.error("Error fetching group events:", err);
            setError('Failed to fetch group events');
        }
    };

    useEffect(() => {
       fetchUserEvents();  
    }, [id]);  


    return (
        <div className="container">
            <div className="section-header">
                <h1>이벤트</h1>
            </div>
            <ScrollContainer className="events-container">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <EventCard
                            key={index}
                            id={event.id}
                            group_id={id}
                            name={event.name}
                            description={event.description}
                            event_date={event.event_date}
                            event_location={event.event_location}
                            fetchUserEvents={fetchUserEvents}
                        />
                    ))
                ) : (
                    <p>일정을 찾지 못했습니다</p>
                )}
                
            </ScrollContainer>
        </div>
    );
}

export default DashboardPage;
