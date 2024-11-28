import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaCrown } from 'react-icons/fa';
import './MemberCard.css';

function MemberCard({ nickname, name, email, user_id, groupCreatedBy }) {
    return (
        <Card className="member-card">
        <Card.Body>
            <Card.Title>
                {nickname}
                {user_id === groupCreatedBy && <FaCrown color="gold" size={24} style={{ marginLeft: '8px' }} />}
            </Card.Title>
            <Card.Text>
            <strong>Name:</strong> {name}
            </Card.Text>
            <Card.Text>
            <strong>Email:</strong> {email}
            </Card.Text>
        </Card.Body>
        </Card>
    );
}

export default MemberCard;
