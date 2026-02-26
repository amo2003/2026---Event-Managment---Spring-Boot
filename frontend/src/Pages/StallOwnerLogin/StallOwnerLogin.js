// src/pages/stallOwner/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./StallOwnerLogin.css";

const StallOwnerLogin = ({ setOwner }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const eventId = location.state?.eventId || 1;

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/stall-owner/login",
        { email, password }
      );

      console.log("Login response:", res.data); // Debug log
      setOwner(res.data);

      // navigate and pass state properly
      navigate(`/stall-application/${res.data.id}/${eventId}`, {
        state: {
          businessName: res.data.businessName || "",
          productType: res.data.productType || "",
        },
      });
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="stall-login-container">
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
      </div>
    </div>
  );
};

export default StallOwnerLogin;