import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();



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
        navigate("/groups/${id}");
    };

    const handleEventSubmit = async () => {
        try {
            await axiosInstance.post(`/groups/${id}/events/`, newEvent);
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
                <h2>멤버</h2>
                <Button variant="primary" onClick={() => setShowInviteModal(true)} className="ml-auto">
                    멤버 초대하기
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
                    <p>멤버를 찾지 못했습니다</p>
                )}
            </ScrollContainer>
        
            <div className="section-header">
                <h2>일정</h2>
                <Button variant="success" onClick={() => setShowEventModal(true)} className="ml-auto">
                    약속 만들기
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
                    <p>일정을 찾지 못했습니다</p>
                )}
                
            </ScrollContainer>
            
            <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>멤버 초대하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="inviteEmail">
                            <Form.Label>메일 주소</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="초대할 사람의 메일을 입력해주세요"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInviteModal(false)}>닫기</Button>
                    <Button variant="primary" onClick={handleInviteSubmit}>초대 보내기</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>약속 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="eventName">
                            <Form.Label>약속 이름</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="약속 이름을 입력해주세요"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="eventDescription">
                            <Form.Label>약속 설명을 작성해주세요</Form.Label>
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
                                placeholder="약속 장소를 입력해주세요"
                                value={newEvent.where}
                                onChange={(e) => setNewEvent({ ...newEvent, where: e.target.value })}
                            />
                        </Form.Group> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEventModal(false)}>닫기</Button>
                    <Button variant="primary" onClick={handleEventSubmit}>약속 만들기</Button>
                </Modal.Footer>
            </Modal>

            </div>
        );
}

export default GroupDetailPage;