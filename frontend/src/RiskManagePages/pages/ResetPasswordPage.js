import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { validateResetPasswordForm } from "../utils/validation";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:"", resetCode:"", newPassword:"", confirmPassword:"" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setMessage("");
    const ve = validateResetPasswordForm(form); setErrors(ve);
    if (Object.keys(ve).length > 0) return;
    try { setMessage(await resetPassword(form) || "Password reset successfully"); setTimeout(() => navigate("/rlogin"), 1200); }
    catch (err) { setError(err.response?.data?.message || "Failed to reset password"); }
  };
  const fields = [["email","email","Officer Email"],["resetCode","text","Reset Code"],["newPassword","password","New Password"],["confirmPassword","password","Confirm Password"]];
  return (
    <div className="rm-auth-scene">
      <div className="rm-auth-back-link"><Link to="/rlogin">← Back</Link></div>
      <div className="rm-auth-center-wrap">
        <div className="rm-auth-panel rm-mono">
          <h2>RESET PASSWORD</h2>
          {error && <div className="rm-message-box rm-error">{error}</div>}
          {message && <div className="rm-message-box rm-success">{message}</div>}
          <form onSubmit={handleSubmit} className="rm-form-grid rm-one-column rm-compact-form">
            {fields.map(([k,t,ph]) => (
              <div key={k} className="rm-form-group">
                <input type={t} value={form[k]} onChange={e => { setForm({...form,[k]:e.target.value}); setErrors({...errors,[k]:""}); }} placeholder={ph} className={errors[k] ? "rm-input-error" : ""} />
                {errors[k] && <small className="rm-field-error">{errors[k]}</small>}
              </div>
            ))}
            <button type="submit" className="rm-btn rm-btn-light rm-wide-btn">RESET PASSWORD</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
