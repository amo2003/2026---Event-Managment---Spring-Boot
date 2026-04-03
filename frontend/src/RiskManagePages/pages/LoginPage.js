import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm, validateOfficerRegisterForm } from "../utils/validation";

const initialRegister = { fullName:"", email:"", password:"", confirmPassword:"", phoneNumber:"", role:"SECURITY_OFFICER" };

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email:"", password:"" });
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    const ve = validateLoginForm(loginForm); setLoginErrors(ve);
    if (Object.keys(ve).length > 0) { setLoading(false); return; }
    try {
      const data = await login(loginForm);
      const from = location.state?.from?.pathname || "/dashboard";
      data.mustChangePassword ? navigate("/change-password") : navigate(from);
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    const ve = validateOfficerRegisterForm(registerForm); setRegisterErrors(ve);
    if (Object.keys(ve).length > 0) { setLoading(false); return; }
    try {
      setSuccess(await register(registerForm) || "Officer registered successfully");
      setRegisterForm(initialRegister); setRegisterErrors({}); setMode("login");
    } catch (err) { setError(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); };

  return (
    <div className="rm-auth-scene">
      <div className="rm-auth-back-link"><Link to="/">← Back</Link></div>
      <div className="rm-auth-center-wrap">
        <div className="rm-auth-panel rm-mono">
          <h2>{mode === "login" ? "OFFICER LOGIN" : "OFFICER REGISTER"}</h2>
          <div className="rm-auth-mode-switch rm-minimal">
            <button className={mode === "login" ? "rm-active" : ""} onClick={() => switchMode("login")}>Login</button>
            <button className={mode === "register" ? "rm-active" : ""} onClick={() => switchMode("register")}>Register</button>
          </div>
          {error && <div className="rm-message-box rm-error">{error}</div>}
          {success && <div className="rm-message-box rm-success">{success}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="rm-form-grid rm-one-column rm-compact-form">
              <div className="rm-form-group">
                <input type="email" value={loginForm.email} onChange={e => { setLoginForm({...loginForm,email:e.target.value}); setLoginErrors({...loginErrors,email:""}); }} placeholder="Email" className={loginErrors.email ? "rm-input-error" : ""} />
                {loginErrors.email && <small className="rm-field-error">{loginErrors.email}</small>}
              </div>
              <div className="rm-form-group">
                <input type="password" value={loginForm.password} onChange={e => { setLoginForm({...loginForm,password:e.target.value}); setLoginErrors({...loginErrors,password:""}); }} placeholder="Password" className={loginErrors.password ? "rm-input-error" : ""} />
                {loginErrors.password && <small className="rm-field-error">{loginErrors.password}</small>}
              </div>
              <button type="submit" className="rm-btn rm-btn-light rm-wide-btn" disabled={loading}>{loading ? "Signing In..." : "LOGIN"}</button>
              <div className="rm-auth-helper-links rm-center-links"><Link to="/forgot-password">Forgot Password?</Link></div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="rm-form-grid rm-compact-form">
              {[["fullName","text","Full Name"],["email","email","Email"],["password","password","Password"],["confirmPassword","password","Confirm Password"],["phoneNumber","text","Phone Number"]].map(([k,t,ph]) => (
                <div key={k} className="rm-form-group">
                  <input type={t} value={registerForm[k]} onChange={e => { setRegisterForm({...registerForm,[k]:e.target.value}); setRegisterErrors({...registerErrors,[k]:""}); }} placeholder={ph} className={registerErrors[k] ? "rm-input-error" : ""} />
                  {registerErrors[k] && <small className="rm-field-error">{registerErrors[k]}</small>}
                </div>
              ))}
              <div className="rm-form-group">
                <select value={registerForm.role} onChange={e => { setRegisterForm({...registerForm,role:e.target.value}); setRegisterErrors({...registerErrors,role:""}); }} className={registerErrors.role ? "rm-input-error" : ""}>
                  <option value="SECURITY_OFFICER">Security Officer</option>
                  <option value="MEDICAL_OFFICER">Medical Officer</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="TECHNICAL_OFFICER">Technical Officer</option>
                </select>
                {registerErrors.role && <small className="rm-field-error">{registerErrors.role}</small>}
              </div>
              <button type="submit" className="rm-btn rm-btn-light rm-wide-btn" disabled={loading}>{loading ? "Registering..." : "CREATE ACCOUNT"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
