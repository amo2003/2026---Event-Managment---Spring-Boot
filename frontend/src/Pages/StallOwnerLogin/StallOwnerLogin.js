// src/pages/stallOwner/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const StallOwnerLogin = ({ setOwner }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get eventId from query param or state passed from EventDetail page
  const eventId = location.state?.eventId || 1; // fallback to 1 if not provided

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/stall-owner/login",
        { email, password }
      );
      setOwner(res.data); // store owner in app state

      // Navigate to stall application page with both ownerId and eventId
      navigate(`/stall-application/${res.data.id}/${eventId}`);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default StallOwnerLogin;