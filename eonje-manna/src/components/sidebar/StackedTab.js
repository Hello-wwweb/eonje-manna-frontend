import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './StackedTab.css';
import { BsPeopleFill } from "react-icons/bs";
import { BsCalendar } from "react-icons/bs";
import { BsGearFill } from "react-icons/bs";
import { BsCompass } from "react-icons/bs";


function StackedTab() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('home');

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

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
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => renderTooltip(props, '대쉬보드로 이동합니다. 사용자의 일정을 간단히 볼 수 있습니다. ')}
      >
        <Nav.Link eventKey="dashboard"><BsCompass /> 대쉬보드</Nav.Link>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => renderTooltip(props, '달력을 확인합니다')}
      >
        <Nav.Link eventKey="calendar">
          <BsCalendar /> 캘린더
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => renderTooltip(props, '그룹을 관리합니다. 그룹의 멤버와 이벤트를 확인할 수 있습니다. ')}
      >
        <Nav.Link eventKey="groups">
          <BsPeopleFill /> 그룹
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => renderTooltip(props, '설정은 비활성화 상태입니다')}
      >
        <Nav.Link eventKey="settings" disabled>
          <BsGearFill /> 설정
        </Nav.Link>
      </OverlayTrigger>
    </Nav>
  );
}

export default StackedTab;