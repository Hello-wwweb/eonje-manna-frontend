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
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [addError, setAddError] = useState(null);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/groups/');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups. Please try again.');
    } finally {
      setLoading(false);
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
          + Add Group
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {addError && <Alert variant="danger">{addError}</Alert>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ScrollContainer className="group-list-scroll">
          {groups.map((group) => (
            <Card key={group.id} className="group-card">
              <Card.Body>
                <Card.Title>{group.name}</Card.Title>
                <Card.Text>{group.description}</Card.Text>
                <Card.Text>
                  <strong>Members:</strong> {Array.isArray(group.members) ? group.members.join(', ') : 'No members'}
                </Card.Text>
                <Button variant="outline-primary" onClick={() => navigate(`/groups/${group.id}`)}>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          ))}
        </ScrollContainer>
      )}

      {/* 그룹 추가 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddGroup}>
            <Form.Group controlId="groupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="groupDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter group description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleAddGroup}>
            Add Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GroupPage;
