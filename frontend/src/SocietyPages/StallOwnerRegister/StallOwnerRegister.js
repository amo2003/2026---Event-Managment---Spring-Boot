// src/pages/stallOwner/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StallOwnerRegister.css";

const StallOwnerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    contactNumber: "",
    businessName: "",
    productType: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.ownerName || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/stall-owner/register", formData);
      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/slogin"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to register");
    }
  };

  return (
    <div className="stall-register-page">
      <div className="stall-register-card">
        <h2>Stall Owner Registration</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleRegister} className="stall-register-form">
          <input
            type="text"
            name="ownerName"
            placeholder="Full Name"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
          />

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="productType"
            placeholder="Product Type"
            value={formData.productType}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">
            Register Stall Owner
          </button>
        </form>
      </div>
    </div>
  );
};

export default StallOwnerRegister;