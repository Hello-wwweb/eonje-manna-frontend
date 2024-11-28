import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import './GroupDetailPage.css'
import EventCard from '../components/card/EventCard';
import MemberCard from '../components/card/MemberCard';
import ScrollContainer from '../components/container/ScrollContainer';

import axiosInstance from '../axiosInstance';

function GroupDetailPage() {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: ''
    });




    const fetchGroupDetails = async () => {
        try {
        const response = await axiosInstance.get(`/groups/${id}`); 
        setGroup(response.data);
        } catch (err) {
        console.error("Error fetching group details:", err);
        setError('Failed to fetch group details');
        } finally {
        setLoading(false);  
        }
    };

    const fetchGroupMembers = async () => {
        try {
            const response = await axiosInstance.get(`/groups/${id}/members`);
            setMembers(response.data);
        } catch (err) {
            console.error("Error fetching group members:", err);
            setError('Failed to fetch group members');
        }
    };

    const fetchGroupEvents = async () => {
        try {
            const response = await axiosInstance.get(`/groups/${id}/events`);
            setEvents(response.data); 
        } catch (err) {
            console.error("Error fetching group events:", err);
            setError('Failed to fetch group events');
        }
    };

    const handleInviteSubmit = async () => {
        try {
            await axiosInstance.post(`/groups/${id}/memberships/`, { email: inviteEmail });
            setShowInviteModal(false); 
            setInviteEmail(''); 
        } catch (err) {
            console.error("Error sending invite:", err);

            if (err.response && err.response.status === 400) {
                const errorMessage = err.response.data.detail || "An error occurred";
                if (errorMessage === "Member already exists") {
                    setError('This user is already a member of the group.');
                } else {
                    setError('Failed to send invite. Please try again.');
                }
            } else {
                setError('Failed to send invite. Please try again.');
            }
        }
    };

    const handleEventSubmit = async () => {
        try {
            await axiosInstance.post(`/groups/${id}/events`, newEvent);
            setShowEventModal(false);
            setNewEvent({ name: '', description: ''});
            fetchGroupEvents(); 
        } catch (err) {
            console.error("Error creating event:", err);
        }
    };

    useEffect(() => {
        fetchGroupDetails();   
        fetchGroupMembers();   
        fetchGroupEvents();  
    }, [id]);  

    if (!group) {
    return <h2>Group not found</h2>;
    }


    return (
        <div className="group-detail">
            <h1>{group.name}</h1>
            <p>{group.description}</p>

        
            <div className="section-header">
                <h2>Members</h2>
                <Button variant="primary" onClick={() => setShowInviteModal(true)} className="ml-auto">
                    Invite Members
                </Button>
            </div>
            
            
            <ScrollContainer className="members-container">
                {members.length > 0 ? (
                    members.map((member, index) => (
                        <MemberCard
                            key={index}
                            nickname={member.nickname}
                            name={member.name}
                            email={member.email}
                            user_id={member.user_id}
                            groupCreatedBy={group.created_by}
                        />
                    ))
                ) : (
                    <p>No members found</p>
                )}
            </ScrollContainer>
        
            <div className="section-header">
                <h2>Events</h2>
                <Button variant="success" onClick={() => setShowEventModal(true)} className="ml-auto">
                    Create Event
                </Button>
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
                            fetchGroupEvents={fetchGroupEvents}
                        />
                    ))
                ) : (
                    <p>No events found</p>
                )}
                
            </ScrollContainer>
            
            <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="inviteEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleInviteSubmit}>Send Invite</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="eventName">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event name"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="eventDescription">
                            <Form.Label>Event Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event description"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                        </Form.Group>
                        
                        {/* <Form.Group controlId="eventWhen">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newEvent.when}
                                onChange={(e) => setNewEvent({ ...newEvent, when: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="eventWhere">
                            <Form.Label>Event Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event location"
                                value={newEvent.where}
                                onChange={(e) => setNewEvent({ ...newEvent, where: e.target.value })}
                            />
                        </Form.Group> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEventModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEventSubmit}>Create Event</Button>
                </Modal.Footer>
            </Modal>

            </div>
        );
}

export default GroupDetailPage;