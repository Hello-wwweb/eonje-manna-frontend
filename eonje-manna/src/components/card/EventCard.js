import React, { useState } from 'react';
import { Card, Button, ButtonGroup, Dropdown, DropdownButton, Modal, Form } from 'react-bootstrap';
import './EventCard.css';
import { BsCalendar, BsGeoAlt } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';


function EventCard({ id, group_id, name, description, event_date, event_location, fetchGroupEvents }) {
    const navigate = useNavigate();

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [newEventDate, setNewEventDate] = useState(event_date);
    const [newEventLocation, setNewEventLocation] = useState(event_location);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleUpdate = async () => {
        try {
            const response = await axiosInstance.patch(`/groups/${group_id}/events/${id}`, {
                name: newName,
                description: newDescription,
                event_date: newEventDate,
                event_location: newEventLocation
            });
            console.log('Event updated:', response.data);
            setShowUpdateModal(false); // Modal 닫기
            fetchGroupEvents();; 
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axiosInstance.delete(`/groups/${group_id}/events/${id}`);
            console.log('Event deleted:', response.data);
            setShowDeleteModal(false); 
            fetchGroupEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };


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

                {/* 버튼 그룹 */}
                <ButtonGroup className="event-buttons">
                    {/* 수정 버튼 */}
                    <Button variant="outline-secondary" onClick={() => setShowUpdateModal(true)}>
                        수정
                    </Button>

                    {/* 삭제 버튼 */}
                    <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                        삭제
                    </Button>

                    <DropdownButton
                        as={ButtonGroup}
                        variant="outline-primary"
                        title="날짜 및 장소 선택"
                        id="picker-dropdown"
                        onSelect={(selectedKey) => {
                            if (selectedKey === 'date') {
                                navigate(`/event/${id}`); 
                            } else if (selectedKey === 'place') {
                                navigate(`/places/${id}`); 
                            }
                        }}
                    >
                        <Dropdown.Item eventKey="date">날짜 선택</Dropdown.Item>
                        <Dropdown.Item eventKey="place">장소 선택</Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
            </Card.Body>

            {/* 수정 Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>이벤트 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="eventName">
                            <Form.Label>이벤트 이름</Form.Label>
                            <Form.Control
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="eventDescription">
                            <Form.Label>이벤트 설명</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </Form.Group>
                            {/* 이벤트 날짜 */}
                            <Form.Group controlId="eventDate">
                                <Form.Label>이벤트 날짜</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                />
                            </Form.Group>

                            {/* 이벤트 장소 */}
                            <Form.Group controlId="eventLocation">
                                <Form.Label>이벤트 장소</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="장소를 입력하세요"
                                    value={newEventLocation}
                                    onChange={(e) => setNewEventLocation(e.target.value)} // 장소 수정
                                />
                            </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        수정하기
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 삭제 확인 Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>이벤트 삭제</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>이 이벤트를 정말 삭제하시겠습니까?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        삭제하기
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default EventCard;