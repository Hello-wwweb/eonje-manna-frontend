import "./DashboardPage.css"

import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import ScrollContainer from '../components/container/ScrollContainer';
import EventCard from '../components/card/EventCard';
import { useState, useEffect } from 'react';
import EventSimpleCard from "../components/card/EventSimpleCard";

function DashboardPage(){


    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const fetchUserEvents = async () => {
        try {
            const response = await axiosInstance.get(`/events/`);
            setEvents(response.data); 
        } catch (err) {
            console.error("Error fetching my events:", err);
            setError('Failed to fetch my events');
        }
    };

    useEffect(() => {
       fetchUserEvents();  
    }, []);


    return (
        <div className="container">
            <div className="section-header">
                <h1>Events</h1>
            </div>
            <ScrollContainer className="events-container">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <EventSimpleCard
                            key={index}
                            id={event.id}
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
