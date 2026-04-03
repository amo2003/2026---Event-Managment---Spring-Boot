import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { validateForgotPasswordForm } from "../utils/validation";
const ForgotPasswordPage = () => {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [resetData, setResetData] = useState(null);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setResetData(null);
    const ve = validateForgotPasswordForm(form); setErrors(ve);
    if (Object.keys(ve).length > 0) return;
    try { setResetData(await forgotPassword(form)); }
    catch (err) { setError(err.response?.data?.message || "Failed to generate reset code"); }
  };
  return (
    <div className="rm-auth-scene">
      <div className="rm-auth-back-link"><Link to="/rlogin">← Back</Link></div>
      <div className="rm-auth-center-wrap">
        <div className="rm-auth-panel rm-mono">
          <h2>FORGOT PASSWORD</h2>
          {error && <div className="rm-message-box rm-error">{error}</div>}
          {resetData && <div className="rm-message-box rm-success"><strong>{resetData.message}</strong><br />Reset Code: <strong>{resetData.resetCode}</strong></div>}
          <form onSubmit={handleSubmit} className="rm-form-grid rm-one-column rm-compact-form">
            <div className="rm-form-group">
              <input type="email" value={form.email} onChange={e => { setForm({email:e.target.value}); setErrors({email:""}); }} placeholder="Officer Email" className={errors.email ? "rm-input-error" : ""} />
              {errors.email && <small className="rm-field-error">{errors.email}</small>}
            </div>
            <button type="submit" className="rm-btn rm-btn-light rm-wide-btn">GENERATE CODE</button>
          </form>
          <div className="rm-auth-helper-links rm-center-links"><Link to="/rreset-password">Go to Reset Password</Link></div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
