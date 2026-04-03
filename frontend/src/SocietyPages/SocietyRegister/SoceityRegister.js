import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SoceityRegister.css";

function SoceityRegister() {
  const navigate = useNavigate();

  const [societyList, setSocietyList] = useState([]);

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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const faculties = [
    "Faculty of Computing",
    "Faculty of Engineering",
    "Faculty of Business",
    "Faculty of Humanities & Science",
    "School of Architecture",
    "William Anglis Institute",
    "Faculty of Graduate Studies"
  ];

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/society-list");
      setSocietyList(res.data);
    } catch (err) {
      console.error("Failed to fetch societies");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "presidentName" || name === "advisorName") {
      if (/\d/.test(value)) return;
    } else if (name === "contactNumber") {
      if (/[^0-9]/.test(value)) return;
      if (value.length > 10) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const e = {};
    if (!formData.name)                    e.name          = "Please select a society.";
    if (!formData.faculty)                 e.faculty       = "Please select a faculty.";
    if (!formData.presidentName.trim())    e.presidentName = "President name is required.";
    if (!formData.email.trim())            e.email         = "Email is required.";
    if (!formData.contactNumber.trim())    e.contactNumber = "Contact number is required.";
    else if (formData.contactNumber.length !== 10) e.contactNumber = "Contact number must be exactly 10 digits.";
    if (!formData.advisorName.trim())      e.advisorName   = "Advisor name is required.";
    if (!formData.password.trim())         e.password      = "Password is required.";
    else if (formData.password.length < 6) e.password      = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const response = await axios.post("http://localhost:8080/api/society/register", formData);
      setGeneratedPin(response.data.pinCode);
      setSuccess("Registration Successful!");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.response?.data?.error || "";
      if (status === 500 || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("email")) {
        setErrors({ email: "This email is already registered." });
      } else {
        setErrors({ general: msg || "Registration Failed!" });
      }
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      {/* ===== BACK BUTTON ===== */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 
      </button>
      <div className="register-container">
        <h1 className="register-title">Society Registration</h1>

        {errors.general && <p className="errorr-msg">{errors.general}</p>}
        {success && <p className="successr-msg">{success}</p>}

        {/* KEEP PIN DISPLAY */}
        {generatedPin && (
          <div className="pin-box">
            <p>Your Society PIN</p>
            <h2>{generatedPin}</h2>
            <span>Please save this PIN for login</span>
          </div>
        )}

        {!success && (
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="select-wrapper">
              <select name="name" value={formData.name} onChange={handleChange} required>
                <option value="">Select Society</option>
                {societyList.map((society) => (
                  <option key={society.id} value={society.name}>{society.name}</option>
                ))}
              </select>
            </div>
            {errors.name && <span className="reg-field-error">{errors.name}</span>}

            <p className="add-society-link" onClick={() => navigate("/addsocieties")}
              style={{ cursor: "pointer", fontSize: "13px", marginBottom: "10px" }}>
              If society name not in list, add your society name
            </p>

            <div className="select-wrapper">
              <select name="faculty" value={formData.faculty} onChange={handleChange} required>
                <option value="">Select Faculty</option>
                {faculties.map((faculty, index) => (
                  <option key={index} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>
            {errors.faculty && <span className="reg-field-error">{errors.faculty}</span>}

            <input type="text" name="presidentName" placeholder="President Name"
              onChange={handleChange} value={formData.presidentName} />
            {errors.presidentName && <span className="reg-field-error">{errors.presidentName}</span>}

            <input type="email" name="email" placeholder="Email Address"
              onChange={handleChange} value={formData.email} />
            {errors.email && <span className="reg-field-error">{errors.email}</span>}

            <input type="text" name="contactNumber" placeholder="Contact Number"
              onChange={handleChange} value={formData.contactNumber} />
            {errors.contactNumber && <span className="reg-field-error">{errors.contactNumber}</span>}

            <input type="text" name="advisorName" placeholder="Advisor Name"
              onChange={handleChange} value={formData.advisorName} />
            {errors.advisorName && <span className="reg-field-error">{errors.advisorName}</span>}

            <input type="password" name="password" placeholder="Password"
              onChange={handleChange} value={formData.password} />
            {errors.password && <span className="reg-field-error">{errors.password}</span>}

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