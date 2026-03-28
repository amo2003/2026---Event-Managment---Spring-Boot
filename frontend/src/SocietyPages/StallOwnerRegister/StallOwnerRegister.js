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
    const { name, value } = e.target;

    // Validation for owner name: only letters and spaces
    if (name === "ownerName") {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData({ ...formData, [name]: filteredValue });
      return;
    }

    // Validation for contact number: only digits, max 10
    if (name === "contactNumber") {
      const filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: filteredValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nameRegex = /^[A-Za-z\s]+$/;
    const contactRegex = /^[0-9]+$/;

    // Basic validation
    if (!formData.ownerName || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required");
      return;
    }

    if (!nameRegex.test(formData.ownerName.trim())) {
      setError("Owner name can only contain letters and spaces");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.contactNumber && formData.contactNumber.length !== 10) {
      setError("Contact number must be exactly 10 digits");
      return;
    }

    if (
      formData.contactNumber &&
      !contactRegex.test(formData.contactNumber)
    ) {
      setError("Contact number can only contain numbers");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/stall-owner/register", formData);
      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/slogin"), 1500);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      const msg = err.response?.data?.message || "";
      if (status === 409 || msg.toLowerCase().includes("email")) {
        setError("This email is already registered.");
      } else {
        setError(msg || "Failed to register");
      }
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
            required
          />

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />

          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Product Type</option>
            <option value="Foods">Foods</option>
            <option value="Cool Beverages">Cool Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Games">Games</option>
          </select>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
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