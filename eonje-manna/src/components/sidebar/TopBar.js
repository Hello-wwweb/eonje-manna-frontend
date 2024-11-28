import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import { ButtonGroup } from "react-bootstrap";

import "./TopBar.css";

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
        <Navbar.Collapse id="navbarScroll" className="ms-auto">
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              // 비로그인 상태
              <ButtonGroup className="ms-auto">
                <Button variant="outline-primary" className="me-2" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="primary" onClick={handleSignup}>
                  Signup
                </Button>
              </ButtonGroup>
            ) : (
              // 로그인 상태
              <NavDropdown title="Profile" id="profile-dropdown" className="profile-dropdown">
                <NavDropdown.Item href="#profile">View Profile</NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
