import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) e.username = "Username is required.";
    if (!formData.password.trim()) e.password = "Password is required.";
    return e;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Hardcoded admin credentials — in production replace with API call
    if (formData.username === "admin" && formData.password === "admin123") {
      const userData = {
        id: "admin",
        token: "admin-token-" + Date.now(),
        role: "ADMIN",
        userType: "admin",
        email: "admin@unifestivo.com",
      };
      login(userData);
      navigate("/");
    } else {
      setErrors({ general: "Invalid username or password." });
    }
  };

  return (
    <div className="al-page">
      <div className="al-card">
        <div className="al-icon">🔐</div>
        <h1 className="al-title">Admin Portal</h1>
        <p className="al-subtitle">Uni Festivo Management System</p>

        {errors.general && <p className="al-error">{errors.general}</p>}

        <form className="al-form" onSubmit={handleLogin}>
          <div className="al-field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter admin username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.username && <span className="al-field-error">{errors.username}</span>}
          </div>

          <div className="al-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="al-field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="al-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
