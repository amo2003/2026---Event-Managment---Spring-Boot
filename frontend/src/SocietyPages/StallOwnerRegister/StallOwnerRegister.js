import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StallOwnerRegister.css";

const StallOwnerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: "", email: "", password: "",
    contactNumber: "", businessName: "", productType: "", address: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // clear field error on change
    setErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "ownerName") {
      setFormData({ ...formData, [name]: value.replace(/[^A-Za-z\s]/g, "") });
      return;
    }
    if (name === "contactNumber") {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, "").slice(0, 10) });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const e = {};
    if (!formData.ownerName.trim())     e.ownerName     = "Full name is required.";
    if (!formData.email.trim())         e.email         = "Email is required.";
    if (!formData.password.trim())      e.password      = "Password is required.";
    else if (formData.password.length < 6) e.password   = "Password must be at least 6 characters.";
    if (!formData.contactNumber.trim()) e.contactNumber = "Contact number is required.";
    else if (formData.contactNumber.length !== 10) e.contactNumber = "Contact number must be exactly 10 digits.";
    if (!formData.businessName.trim())  e.businessName  = "Business name is required.";
    if (!formData.productType)          e.productType   = "Please select a product type.";
    if (!formData.address.trim())       e.address       = "Address is required.";
    return e;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      await axios.post("http://localhost:8080/api/stall-owner/register", formData);
      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/slogin"), 1500);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "";
      if (status === 409 || msg.toLowerCase().includes("email")) {
        setErrors({ email: "This email is already registered." });
      } else {
        setErrors({ general: msg || "Failed to register" });
      }
    }
  };

  const F = ({ name }) => errors[name]
    ? <span className="reg-field-error">{errors[name]}</span>
    : null;

  return (
    <div className="stall-register-page">
      <div className="stall-register-card">
        <h2>Stall Owner Registration</h2>

        {errors.general && <p className="error-msg">{errors.general}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleRegister} className="stall-register-form">
          <input type="text" name="ownerName" placeholder="Full Name"
            value={formData.ownerName} onChange={handleChange} />
          <F name="ownerName" />

          <input type="email" name="email" placeholder="Email Address"
            value={formData.email} onChange={handleChange} />
          <F name="email" />

          <input type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange} />
          <F name="password" />

          <input type="text" name="contactNumber" placeholder="Contact Number"
            value={formData.contactNumber} onChange={handleChange} />
          <F name="contactNumber" />

          <input type="text" name="businessName" placeholder="Business Name"
            value={formData.businessName} onChange={handleChange} />
          <F name="businessName" />

          <select name="productType" value={formData.productType} onChange={handleChange}>
            <option value="" disabled>Select Product Type</option>
            <option value="Foods">Foods</option>
            <option value="Cool Beverages">Cool Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Games">Games</option>
          </select>
          <F name="productType" />

          <input type="text" name="address" placeholder="Address"
            value={formData.address} onChange={handleChange} />
          <F name="address" />

          <button type="submit" className="register-btn">Register Stall Owner</button>
        </form>
      </div>
    </div>
  );
};

export default StallOwnerRegister;
