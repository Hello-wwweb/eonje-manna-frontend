import React from 'react';
import { Card } from 'react-bootstrap';
import './EventCard.css';import { BsCalendar, BsGeoAlt } from 'react-icons/bs';

function EventCard({ title, when, where, description }) {
    return (
    <Card className="event-card">
        <Card.Body>
        <div className="event-header">
            <Card.Title>{title}</Card.Title>
            <hr className="event-divider" />
        </div>
        <div className="event-info">
            <p>
                <BsCalendar className="event-icon" />
                {when}
            </p>
            <p>
                <BsGeoAlt className="event-icon" />
                {where}
            </p>
        </div>
        <div className="event-description">
            <p>{description}</p>
        </div>
        </Card.Body>
    </Card>
    );
}

export default EventCard;