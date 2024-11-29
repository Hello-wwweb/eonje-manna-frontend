import React, { useState } from "react";
import axios from "axios";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};

    // Validation for username
    if (!formData.username || formData.username.length < 1) {
      newErrors.username = "Username is required and must be at least 1 character.";
    }

    // Validation for password
    if (!formData.password || formData.password.length < 1 || formData.password.length > 100) {
      newErrors.password = "Password is required and must be between 1 and 100 characters.";
    }

    // Validation for name
    if (!formData.name || formData.name.length < 1 || formData.name.length > 100) {
      newErrors.name = "Name is required and must be between 1 and 100 characters.";
    }

    // Validation for email
    if (!formData.email || formData.email.length < 1 || formData.email.length > 100) {
      newErrors.email = "Email is required and must be between 1 and 100 characters.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axiosInstance.post("/signup/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("회원가입 성공:", response.data);
      alert("회원가입에 성공했습니다!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error.response ? error.response.data : error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="signup-form">
      <h1 className="signup-title">회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">메일 주소</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <button type="submit" className="submit-button">회원가입</button>
      </form>
    </div>
  );
};

export default SignupForm;
