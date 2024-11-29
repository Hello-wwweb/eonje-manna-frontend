import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Form, Alert } from 'react-bootstrap';
import './GroupPage.css';
import { BsCaretLeftFill, BsCaretRightFill, BsChevronRight } from "react-icons/bs";

import ScrollContainer from '../components/container/ScrollContainer';

import axiosInstance from '../axiosInstance';
import axios from 'axios';

function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [addError, setAddError] = useState(null);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get('/groups/');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups. Please try again.');
    } finally {
    }
  };

  const addGroup = async () => {
    setAddError(null); 
    try {
      const response = await axiosInstance.post('/groups/', {
        name: newGroup.name,
        description: newGroup.description,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setGroups([...groups, response.data]);
      setNewGroup({ name: '', description: '' });
      
      setShowModal(false);
    } catch (err) {
      console.error('Error adding group:', err);
      setAddError('Failed to add group. Please try again.');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = (e) => {
    e.preventDefault();
    addGroup();
  };

  return (
    <div className="group-page-container">
      <div className="header">
        <h1>Groups</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + 그룹 만들기
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {addError && <Alert variant="danger">{addError}</Alert>}

        <ScrollContainer className="group-list-scroll">
          {groups.map((group) => (
            <Card key={group.id} className="group-card">
              <Card.Body>
                <Card.Title>{group.name}</Card.Title>
                <Card.Text>{group.description}</Card.Text>
                <Card.Text>
                  <strong>멤버:</strong> {Array.isArray(group.members) ? group.members.join(', ') : '멤버가 없습니다'}
                </Card.Text>
                <Button variant="outline-primary" onClick={() => navigate(`/groups/${group.id}`)}>
                  자세히 보기
                </Button>
              </Card.Body>
            </Card>
          ))}
        </ScrollContainer>
      

      {/* 그룹 추가 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>그룹 만들기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddGroup}>
            <Form.Group controlId="groupName">
              <Form.Label>그룹 이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="그룹 이름을 입력해주세요"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="groupDescription">
              <Form.Label>그룹 설명</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="그룹 설명을 작성해주세요"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
          <Button variant="primary" type="submit" onClick={handleAddGroup}>
            그룹 추가
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GroupPage;
