import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  validateLoginForm,
  validateOfficerRegisterForm,
} from "../utils/validation";

const initialRegister = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  role: "SECURITY_OFFICER",
};

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const validationErrors = validateLoginForm(loginForm);
    setLoginErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const data = await login(loginForm);
      const from = location.state?.from?.pathname || "/dashboard";

      if (data.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const validationErrors = validateOfficerRegisterForm(registerForm);
    setRegisterErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const message = await register(registerForm);
      setSuccess(message || "Officer registered successfully");
      setRegisterForm(initialRegister);
      setRegisterErrors({});
      setMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-scene">
      <div className="auth-back-link">
        <Link to="/">← Back</Link>
      </div>

      <div className="auth-center-wrap">
        <div className="auth-panel mono">
          <h2>{mode === "login" ? "OFFICER LOGIN" : "OFFICER REGISTER"}</h2>

          <div className="auth-mode-switch minimal">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
            >
              Register
            </button>
          </div>

          {error && <div className="message-box error">{error}</div>}
          {success && <div className="message-box success">{success}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="form-grid one-column compact-form">
              <div className="form-group">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    setLoginErrors({ ...loginErrors, email: "" });
                  }}
                  placeholder="Email"
                  className={loginErrors.email ? "input-error" : ""}
                />
                {loginErrors.email && <small className="field-error">{loginErrors.email}</small>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    setLoginErrors({ ...loginErrors, password: "" });
                  }}
                  placeholder="Password"
                  className={loginErrors.password ? "input-error" : ""}
                />
                {loginErrors.password && <small className="field-error">{loginErrors.password}</small>}
              </div>

              <button type="submit" className="btn btn-light wide-btn" disabled={loading}>
                {loading ? "Signing In..." : "LOGIN"}
              </button>

              <div className="auth-helper-links center-links">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="form-grid compact-form">
              <div className="form-group">
                <input
                  type="text"
                  value={registerForm.fullName}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, fullName: e.target.value });
                    setRegisterErrors({ ...registerErrors, fullName: "" });
                  }}
                  placeholder="Full Name"
                  className={registerErrors.fullName ? "input-error" : ""}
                />
                {registerErrors.fullName && <small className="field-error">{registerErrors.fullName}</small>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, email: e.target.value });
                    setRegisterErrors({ ...registerErrors, email: "" });
                  }}
                  placeholder="Email"
                  className={registerErrors.email ? "input-error" : ""}
                />
                {registerErrors.email && <small className="field-error">{registerErrors.email}</small>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, password: e.target.value });
                    setRegisterErrors({ ...registerErrors, password: "" });
                  }}
                  placeholder="Password"
                  className={registerErrors.password ? "input-error" : ""}
                />
                {registerErrors.password && <small className="field-error">{registerErrors.password}</small>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                    setRegisterErrors({ ...registerErrors, confirmPassword: "" });
                  }}
                  placeholder="Confirm Password"
                  className={registerErrors.confirmPassword ? "input-error" : ""}
                />
                {registerErrors.confirmPassword && (
                  <small className="field-error">{registerErrors.confirmPassword}</small>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  value={registerForm.phoneNumber}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, phoneNumber: e.target.value });
                    setRegisterErrors({ ...registerErrors, phoneNumber: "" });
                  }}
                  placeholder="Phone Number"
                  className={registerErrors.phoneNumber ? "input-error" : ""}
                />
                {registerErrors.phoneNumber && <small className="field-error">{registerErrors.phoneNumber}</small>}
              </div>

              <div className="form-group">
                <select
                  value={registerForm.role}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, role: e.target.value });
                    setRegisterErrors({ ...registerErrors, role: "" });
                  }}
                  className={registerErrors.role ? "input-error" : ""}
                >
                  <option value="SECURITY_OFFICER">Security Officer</option>
                  <option value="MEDICAL_OFFICER">Medical Officer</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="TECHNICAL_OFFICER">Technical Officer</option>
                </select>
                {registerErrors.role && <small className="field-error">{registerErrors.role}</small>}
              </div>

              <button type="submit" className="btn btn-light wide-btn" disabled={loading}>
                {loading ? "Registering..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;