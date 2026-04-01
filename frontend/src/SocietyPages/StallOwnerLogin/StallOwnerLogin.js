import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./StallOwnerLogin.css";

const StallOwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const e = {};
    if (!email.trim())    e.email    = "Email is required.";
    if (!password.trim()) e.password = "Password is required.";
    return e;
  };

  const handleLogin = async () => {
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const res = await axios.post("http://localhost:8080/api/stall-owner/login", { email, password });
      const userData = {
        id: res.data.id,
        token: "stall-owner-token-" + res.data.id,
        role: "STALL_OWNER", userType: "stallOwner",
        email: res.data.email, ownerName: res.data.ownerName,
      };
      login(userData);
      navigate(`/owner-profile/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setErrors({ general: "Login failed. Please check your credentials." });
    }
  };

  return (
    <div className="stall-login-container">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <div className="stall-login-card">
        <h2>Stall Owner Login</h2>

        {errors.general && <p className="stall-login-error">{errors.general}</p>}

        <input type="email" placeholder="Enter Email"
          value={email} onChange={(e) => { setErrors(p => ({...p, email:""})); setEmail(e.target.value); }} />
        {errors.email && <span className="login-field-error">{errors.email}</span>}

        <input type="password" placeholder="Enter Password"
          value={password} onChange={(e) => { setErrors(p => ({...p, password:""})); setPassword(e.target.value); }} />
        {errors.password && <span className="login-field-error">{errors.password}</span>}

        <button onClick={handleLogin}>Login</button>

        <p className="forgot-password-link">
          <span onClick={() => navigate("/sforgot-password")}>Forgot Password?</span>
        </p>
        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/sregister")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default StallOwnerLogin;
