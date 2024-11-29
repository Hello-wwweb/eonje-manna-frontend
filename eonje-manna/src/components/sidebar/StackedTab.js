import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './StackedTab.css';
import { BsPeopleFill } from "react-icons/bs";
import { BsCalendar } from "react-icons/bs";
import { BsGearFill } from "react-icons/bs";
import { BsCompass } from "react-icons/bs";


function StackedTab() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('home');

  return (
    <Nav
      variant="pills"
      activeKey={activeKey}
      onSelect={(selectedKey) => {
        setActiveKey(selectedKey);
        navigate(`/${selectedKey}`);
      }}
      className="flex-column"
    >
      <Nav.Link eventKey="dashboard"><BsCompass /> 대쉬보드</Nav.Link>
      <Nav.Link eventKey="calendar"><BsCalendar /> 캘린더</Nav.Link>
      <Nav.Link eventKey="groups"><BsPeopleFill /> 그룹</Nav.Link>
      <Nav.Link eventKey="place">장소</Nav.Link>
      <Nav.Link eventKey="settings" disabled>
      <BsGearFill /> 설정
      </Nav.Link>
    </Nav>
  );
}

export default StackedTab;