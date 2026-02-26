// src/pages/stallOwner/Login.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./StallOwnerLogin.css";

const StallOwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      // Check if admin credentials
      if (email === "admin" && password === "admin123") {
        const userData = {
          id: "admin",
          token: "admin-token-" + Date.now(),
          role: "ADMIN",
          userType: "admin",
          email: "admin@eventmanagement.com",
        };

        login(userData);
        navigate("/");
        return;
      }

      // Otherwise, try stall owner login
      const res = await axios.post(
        "http://localhost:8080/api/stall-owner/login",
        { email, password }
      );

      console.log("Login response:", res.data);

      // Save to AuthContext
      const userData = {
        id: res.data.id,
        token: "stall-owner-token-" + res.data.id,
        role: "STALL_OWNER",
        userType: "stallOwner",
        email: res.data.email,
        ownerName: res.data.ownerName,
      };

      login(userData);

      // Navigate to stall owner profile
      navigate(`/owner-profile/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="stall-login-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ←
      </button>
      <div className="stall-login-card">
        <h2>Stall Owner Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/sregister")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default StallOwnerLogin;