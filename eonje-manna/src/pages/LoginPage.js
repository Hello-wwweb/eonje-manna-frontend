import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Login.css"; // Additional CSS styling
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosInstance";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Assuming you have a context or global state for auth

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/login/", { username, password });

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.data && response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token); // Assuming you have both tokens
        console.log("Login successful");

        login(response.data.access_token, response.data.refresh_token); // Store tokens in context
        navigate("/home"); // Navigate to the home page
      } else {
        console.error("로그인 실패: 응답에 access_token이 없습니다.");
        setLoginCheck(true); // Display login error message
      }
    } catch (error) {
      console.error("로그인 요청 중 에러:", error);
      setLoginCheck(true); // Display login error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-container shadow-lg p-4 rounded bg-white">
        <h1 className="text-center mb-4">On&Off</h1>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>아이디</Form.Label>
            <Form.Control
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {loginCheck && (
            <Alert variant="danger" className="text-center">
              이메일 혹은 비밀번호가 틀렸습니다.
            </Alert>
          )}

          <Button type="submit" variant="primary" className="w-100">
            로그인
          </Button>
        </Form>
        <p className="text-center mt-3">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </Container>
  );
};

export default Login;