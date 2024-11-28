import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Login.css"; // Additional CSS styling
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);

  const { login } = useAuth(); // Assuming you have a context or global state for auth

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      if (response.ok) {
        const result = await response.json(); // Parse JSON response

        console.log("서버 응답:", result);

        if (result.message === "Login successful") {
          // Store tokens in localStorage
          localStorage.setItem("access_token", result.access_token);
          localStorage.setItem("refresh_token", result.refresh_token);
        
          navigate("/home"); // Navigate to the home page
          login(result.access_token, result.refresh_token);
        } else {
          console.error("로그인 실패: 메시지가 예상과 다릅니다.");
          setLoginCheck(true); // Display login error message
        }
      } else {
        const errorResult = await response.json(); // Parse error response
        console.error("에러 응답:", errorResult);
        setLoginCheck(true); // Display login error message
      }
    } catch (error) {
      console.error("로그인 요청 중 에러:", error);
      setLoginCheck(true);
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
