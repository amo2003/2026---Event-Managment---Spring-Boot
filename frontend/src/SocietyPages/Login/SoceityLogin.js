import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./SoceityLogin.css";

function SoceityLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "", pinCode: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim())    e.email    = "Email is required.";
    if (!formData.password.trim()) e.password = "Password is required.";
    if (!formData.pinCode.trim())  e.pinCode  = "Society PIN is required.";
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const response = await axios.post("http://localhost:8080/api/society/login", formData);
      const userData = {
        id: response.data.id,
        token: response.data.token,
        role: response.data.role,
        userType: "society",
        faculty: response.data.faculty,
        societyName: response.data.name,
        email: response.data.email,
      };
      login(userData);
      setSuccess(`Welcome ${userData.societyName}`);
      setTimeout(() => { navigate("/"); window.location.reload(); }, 1000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || err.response?.data?.error || "Login Failed!" });
    }
  };

  return (
    <div className="login-page">
      <button className="back-btnn" onClick={() => navigate(-1)}>←</button>
      <div className="login-container">
        <h1 className="login-title">Society Login</h1>

        {errors.general && <p className="error-msg">{errors.general}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email Address"
            value={formData.email} onChange={handleChange} />
          {errors.email && <span className="login-field-error">{errors.email}</span>}

          <input type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange} />
          {errors.password && <span className="login-field-error">{errors.password}</span>}

          <input type="text" name="pinCode" placeholder="Society PIN"
            value={formData.pinCode} onChange={handleChange} />
          {errors.pinCode && <span className="login-field-error">{errors.pinCode}</span>}

          <button type="submit" className="loginl-btn">Login</button>
        </form>

        <p className="forgot-password-link">
          <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
        </p>
      </div>
    </div>
  );
}

export default SoceityLogin;
