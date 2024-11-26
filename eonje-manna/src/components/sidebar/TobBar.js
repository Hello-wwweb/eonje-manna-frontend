import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BsHouse } from "react-icons/bs";

function NavScrollExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ padding: '10px 20px' }}>
      <Container fluid>
        {/* 로고 */}
        <Navbar.Brand href="/home"><BsHouse /> Home</Navbar.Brand>
        
        {/* 모바일 토글 */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="ms-auto d-none d-lg-block">
            
          {/* 검색창 */}
          {/** 
           *  <Form className="d-flex mx-auto" style={{ width: '50%' }}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        
          */}

          
          {/* 프로필 드롭다운 */}
          <Nav>
            <NavDropdown
              title={
                <img
                  src="/profile.png"
                  alt="Profile"
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                />
              }
              id="profile-dropdown"
              align="end" // 드롭다운 오른쪽 정렬
            >
              <NavDropdown.Item href="#profile">View Profile</NavDropdown.Item>
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
