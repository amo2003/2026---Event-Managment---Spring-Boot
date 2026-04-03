// src/Pages/ForgotPassword/SocietyForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SocietyForgotPassword.css"; // updated CSS

const SocietyForgotPassword = () => {
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
      await axios.post("http://localhost:8080/api/society/forgot-password", {
        email: email,
        password: newPassword,
      });

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);

      if (err.response) {
        const errorMsg =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data?.message || "Password reset failed!";
        setError(errorMsg);
      } else if (err.request) {
        setError("No response from server. Please check if the backend is running.");
      } else {
        setError("An error occurred: " + err.message);
      }
    }
  };

  return (
    <div className="sfp-page">
      <button className="sfp-back-btn" onClick={() => navigate("/login")}>
        ←
      </button>
      <div className="sfp-container">
        <h1 className="sfp-title">Reset Society Password</h1>

        {error && <p className="sfp-error-msg">{error}</p>}
        {success && <p className="sfp-success-msg">{success}</p>}

        <form onSubmit={handleReset} className="sfp-form">
          <div className="sfp-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="sfp-form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="sfp-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sfp-reset-btn">
            Reset Password
          </button>
        </form>

        <p className="sfp-back-to-login">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")}>Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default SocietyForgotPassword;