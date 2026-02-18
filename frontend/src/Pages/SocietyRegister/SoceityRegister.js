import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SoceityRegister.css";

function SoceityRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    faculty: "",
    presidentName: "",
    email: "",
    contactNumber: "",
    advisorName: "",
    password: "",
  });

  const [generatedPin, setGeneratedPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const faculties = [
    "Faculty of Computing",
    "Faculty of Engineering",
    "Faculty of Business",
    "Faculty of Science",
    "Faculty of Humanities",
    "Faculty of Medicine"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/society/register",
        formData
      );

      setGeneratedPin(response.data.pinCode);
      setSuccess("Registration Successful!");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration Failed!"
      );
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Society Registration</h1>

        {error && <p className="errorr-msg">{error}</p>}
        {success && <p className="successr-msg">{success}</p>}

        {generatedPin && (
          <div className="pin-box">
            <p>Your Society PIN</p>
            <h2>{generatedPin}</h2>
            <span>Please save this PIN for login</span>
          </div>
        )}

        {!success && (
          <form className="register-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Society Name" onChange={handleChange} required />

            {/* 🔥 Faculty Dropdown */}
            <div className="select-wrapper">
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty, index) => (
                  <option key={index} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <input type="text" name="presidentName" placeholder="President Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
            <input type="text" name="advisorName" placeholder="Advisor Name" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

            <button type="submit" className="register-btn">
              Register Society
            </button>
          </form>
        )}

        {success && (
          <button className="login-btn" onClick={goToLogin}>
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default SoceityRegister;
