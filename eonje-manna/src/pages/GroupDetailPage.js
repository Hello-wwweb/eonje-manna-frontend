import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import './GroupDetailPage.css'
import EventCard from '../components/card/EventCard';
import MemberCard from '../components/card/MemberCard';
import ScrollContainer from '../components/container/ScrollContainer';

function GroupDetailPage() {
    const { id } = useParams();
  
    // 더미 데이터 (API에서 데이터를 가져오는 경우에는 별도의 상태 관리 필요)
    const groups = [
    {
        id: 1,
        name: 'Study Group',
        description: 'A group for study enthusiasts',
        members: [
        { nickname: 'Alice', email: 'alice@example.com' },
        { nickname: 'Bob', email: 'bob@example.com' },
        { nickname: 'Bob', email: 'bob@example.com' },
        { nickname: 'Bob', email: 'bob@example.com' },
        { nickname: 'Bob', email: 'bob@example.com' },
        ],
        events: [
        {
            title: 'Math Quiz',
            when: '2023-11-25 14:00',
            where: 'Room 101, Study Center',
            description: 'A fun quiz on math topics.',
        },
        {
            title: 'Weekly Study',
            when: 'Every Friday 17:00',
            where: 'Library',
            description: 'Weekly study session with peers.',
        },
        ],
    },
    ];
    
    // ID에 해당하는 그룹 찾기
    const group = groups.find((group) => group.id === parseInt(id));

    if (!group) {
        return <h2>Group not found</h2>;
    }


    return (
        <div className="group-detail">
            <h1>{group.name}</h1>
            <p>{group.description}</p>
        
            <h2>Members</h2>
            <ScrollContainer className="members-container">
                {group.members.map((member, index) => (
                <MemberCard
                    key={index}
                    nickname={member.nickname}
                    name={member.name}
                    email={member.email}
                />
                ))}
            </ScrollContainer>
        
            <h2>Events</h2>
            <ScrollContainer className="events-container">
                {group.events.map((event, index) => (
                <EventCard
                    key={index}
                    title={event.title}
                    when={event.when}
                    where={event.where}
                    description={event.description}
                />
                ))}
            </ScrollContainer>
            </div>
        );
}

export default GroupDetailPage;