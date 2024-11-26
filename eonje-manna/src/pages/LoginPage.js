import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Login.css"; // 추가적인 CSS 스타일링을 위해 별도 파일 생성
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);

        if (response.ok) {
            const result = await response.json(); // 성공한 경우 JSON 응답 처리
            console.log("서버 응답:", result);
            navigate("/home");
            login();
          } else {
            const errorResult = await response.json(); // 실패한 경우 JSON 응답 처리
            console.error("에러 응답:", errorResult);
            setLoginCheck(true); // 로그인 실패 메시지 표시
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
