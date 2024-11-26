import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";

function NavScrollExample() {
  const { isAuthenticated, login, logout } = useAuth(); // 로그인 상태와 관리 함수 가져오기
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    logout(); // 전역 로그아웃 상태 업데이트
    alert("Logged out successfully!");
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ padding: "10px 20px" }}>
      <Container fluid>
        {/* 로고 */}
        <Navbar.Brand href="/home">
          <BsHouse /> Home
        </Navbar.Brand>

        {/* 모바일 토글 */}
        <Navbar.Toggle aria-controls="navbarScroll" />
<<<<<<< HEAD
        <Navbar.Collapse id="navbarScroll" className="ms-auto">
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              // 비로그인 상태
              <>
                <Button variant="outline-primary" className="me-2" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="primary" onClick={handleSignup}>
                  Signup
                </Button>
              </>
            ) : (
              // 로그인 상태
              <NavDropdown
                title="Profile" // 로그인 시 표시될 메뉴 제목
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#profile">View Profile</NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
=======
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
>>>>>>> 9e9da89bff2e934cdbacb2ae1a2cadd57f5a682b
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
