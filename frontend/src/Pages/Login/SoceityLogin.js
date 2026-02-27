// src/Pages/Login/SoceityLogin.js
import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./SoceityLogin.css";

function SoceityLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    pinCode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/society/login",
        formData
      );

      // save user info in context & localStorage
      const userData = {
        id: response.data.id, 
        token: response.data.token,
        role: response.data.role,
        userType: "society", // Add user type
        faculty: response.data.faculty,
        societyName: response.data.name, // Add society name
        email: response.data.email,
      };

      login(userData);
      setSuccess(`Welcome ${userData.societyName}`);

      // redirect to home after 1s
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login Failed!"
      );
    }
  };

  return (
    <div className="login-page">
      <button className="back-btnn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="login-container">
        <h1 className="login-title">Society Login</h1>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pinCode"
            placeholder="Society PIN"
            onChange={handleChange}
            required
          />
          <button type="submit" className="loginl-btn">Login</button>
        </form>

        <p className="forgot-password-link">
          <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
        </p>
      </div>
    </div>
  );
}

export default SoceityLogin;
