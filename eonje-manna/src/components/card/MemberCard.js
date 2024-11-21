import React from 'react';
import { Card } from 'react-bootstrap';
import './MemberCard.css';

function MemberCard({ nickname, name, email }) {
    return (
        <Card className="member-card">
        <Card.Body>
            <Card.Title>{nickname}</Card.Title>
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
