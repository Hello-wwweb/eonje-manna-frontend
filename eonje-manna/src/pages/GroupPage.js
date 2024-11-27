import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import './GroupPage.css';
import { BsCaretLeftFill } from "react-icons/bs";
import { BsCaretRightFill } from "react-icons/bs";
import { BsChevronRight } from "react-icons/bs";

import ScrollContainer from '../components/container/ScrollContainer';

// 데이터 주고 받기에 쓸 프레임워크
import axios from "axios"

function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [addError, setAddError] = useState(null);
  const navigate = useNavigate();

  // const [groups, setGroups] = useState([
  //   { id: 1, name: 'Study Group', description: 'A group for study enthusiasts', members: ['Alice', 'Bob', 'Charlie'] },
  //   { id: 2, name: 'Music Lovers', description: 'Share and enjoy music together', members: ['David', 'Eve'] },
  //   { id: 3, name: 'Book Club', description: 'Discuss and share book reviews', members: ['Frank', 'Grace'] },
  //   { id: 4, name: 'Tech Innovators', description: 'Explore technology trends', members: ['Heidi', 'Ivan', 'Judy'] },
  //   { id: 5, name: 'Fitness Buddies', description: 'Stay fit and motivated together', members: ['Karl', 'Laura'] },
  // ]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/groups/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(data); 
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.message);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };


  const addGroup = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/groups/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGroup.name,
          description: newGroup.description,
        }),
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Failed to add group');
      }

      const createdGroup = await response.json();
      setGroups([...groups, createdGroup]); // 새로 추가된 그룹을 목록에 반영
      setNewGroup({ name: '', description: '' });
      setShowModal(false);
      setAddError(null);
    } catch (err) {
      console.error('Error adding group:', err);
      setAddError('Failed to add group. Please try again.');
    }
  };

  // 컴포넌트가 렌더링될 때 데이터 가져오기
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

      {/* 화살표와 리스트 컨테이너 */}
      <ScrollContainer className="group-list-scroll">
        {groups.map((group) => (
          <Card key={group.id} className="group-card">
            <Card.Body>
              <Card.Title>{group.name}</Card.Title>
              <Card.Text>{group.description}</Card.Text>
              <Card.Text>
                <strong>Members:</strong> {group.members.join(', ')}
              </Card.Text>
              <Button variant="outline-primary" onClick={() => navigate(`/groups/${group.id}`)}>
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))}
      </ScrollContainer>

      {/* Modal for adding a group */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="groupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
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
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddGroup}>
            Add Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GroupPage;
