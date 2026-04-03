import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateChangePasswordForm } from "../utils/validation";
const ChangePasswordPage = () => {
  const { completePasswordChange } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setMessage("");
    const ve = validateChangePasswordForm(form); setErrors(ve);
    if (Object.keys(ve).length > 0) return;
    try { const r = await completePasswordChange(form); setMessage(r || "Password changed successfully"); setTimeout(() => navigate("/dashboard"), 1200); }
    catch (err) { setError(err.response?.data?.message || "Failed to change password"); }
  };
  return (
    <div className="rm-auth-page">
      <div className="rm-auth-card rm-single-card">
        <h2>Change Password</h2>
        <p className="rm-auth-subtext">Update your password to continue.</p>
        {error && <div className="rm-message-box rm-error">{error}</div>}
        {message && <div className="rm-message-box rm-success">{message}</div>}
        <form onSubmit={handleSubmit} className="rm-form-grid rm-one-column">
          {[["currentPassword","Current Password"],["newPassword","New Password"],["confirmPassword","Confirm New Password"]].map(([k,l]) => (
            <div key={k} className="rm-form-group">
              <label>{l}</label>
              <input type="password" value={form[k]} onChange={e => { setForm({...form,[k]:e.target.value}); setErrors({...errors,[k]:""}); }} className={errors[k] ? "rm-input-error" : ""} />
              {errors[k] && <small className="rm-field-error">{errors[k]}</small>}
            </div>
          ))}
          <button type="submit" className="rm-btn rm-btn-primary rm-btn-full">Save New Password</button>
        </form>
      </div>
    </div>
  );
};
export default ChangePasswordPage;
