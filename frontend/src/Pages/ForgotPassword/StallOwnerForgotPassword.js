// src/Pages/ForgotPassword/StallOwnerForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const StallOwnerForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/stall-owner/forgot-password", {
        email: email,
        password: newPassword,
      });

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/slogin");
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);
      
      if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.message || 
                        (typeof err.response.data === 'string' ? err.response.data : "Password reset failed!");
        setError(errorMsg);
      } else if (err.request) {
        // Request made but no response
        setError("No response from server. Please check if the backend is running.");
      } else {
        // Something else happened
        setError("An error occurred: " + err.message);
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <button className="back-btn" onClick={() => navigate("/slogin")}>
        ←
      </button>
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Reset Stall Owner Password</h1>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>

        <p className="back-to-login">
          Remember your password?{" "}
          <span onClick={() => navigate("/slogin")}>Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default StallOwnerForgotPassword;
