import React, { useState } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import './GroupPage.css';

function GroupPage() {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Study Group', description: 'A group for study enthusiasts' },
    { id: 2, name: 'Music Lovers', description: 'Share and enjoy music together' },
    { id: 3, name: 'Book Club', description: 'Discuss and share book reviews' },
    { id: 4, name: 'Tech Innovators', description: 'Explore technology trends' },
    { id: 5, name: 'Fitness Buddies', description: 'Stay fit and motivated together' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  const handleAddGroup = () => {
    setGroups([...groups, { id: groups.length + 1, ...newGroup }]);
    setNewGroup({ name: '', description: '' });
    setShowModal(false);
  };

  const scrollList = (direction) => {
    const container = document.querySelector('.group-list-container');
    const scrollAmount = 300; // 한 번에 스크롤할 거리
    if (direction === 'left') container.scrollLeft -= scrollAmount;
    if (direction === 'right') container.scrollLeft += scrollAmount;
  };

  return (
    <div className="group-page-container">
      <div className="header">
        <h1>Your Groups</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Group
        </Button>
      </div>

      {/* 화살표와 리스트 컨테이너 */}
      <div className="scroll-container">
        <Button
          variant="outline-secondary"
          className="scroll-button left"
          onClick={() => scrollList('left')}
        >
          ◀
        </Button>
        <div className="group-list-container">
          <div className="group-list">
            {groups.map((group) => (
              <Card key={group.id} className="group-card">
                <Card.Body>
                  <Card.Title>{group.name}</Card.Title>
                  <Card.Text>{group.description}</Card.Text>
                  <Button variant="outline-primary">View Details</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
        <Button
          variant="outline-secondary"
          className="scroll-button right"
          onClick={() => scrollList('right')}
        >
          ▶
        </Button>
      </div>

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
