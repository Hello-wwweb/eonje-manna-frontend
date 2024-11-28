import React, { useState } from 'react';
import { Card, Button, ButtonGroup, Dropdown, DropdownButton, Modal, Form } from 'react-bootstrap';
import './EventCard.css';
import { BsCalendar, BsGeoAlt } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function EventSimpleCard({ id, group_id, name, description, event_date, event_location }) {
    const navigate = useNavigate();

    return (
        <Card className="event-card">
            <Card.Body>
                <div className="event-header">
                    <Card.Title>{name}</Card.Title>
                    <hr className="event-divider" />
                </div>
                <div className="event-info">
                    <p>
                        <BsCalendar className="event-icon" />
                        {event_date}
                    </p>
                    <p>
                        <BsGeoAlt className="event-icon" />
                        {event_location}
                    </p>
                </div>
                <div className="event-description">
                    <p>{description}</p>
                </div>
            </Card.Body>
        </Card>
    );
}

export default EventSimpleCard;