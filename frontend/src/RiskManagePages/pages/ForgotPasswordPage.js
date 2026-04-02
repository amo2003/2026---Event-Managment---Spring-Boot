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
    e.preventDefault();
    setError("");
    setResetData(null);

    const validationErrors = validateForgotPasswordForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const data = await forgotPassword(form);
      setResetData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate reset code");
    }
  };

  return (
    <div className="auth-scene">
      <div className="auth-back-link">
        <Link to="/login">← Back</Link>
      </div>

      <div className="auth-center-wrap">
        <div className="auth-panel mono">
          <h2>FORGOT PASSWORD</h2>

          {error && <div className="message-box error">{error}</div>}

          {resetData && (
            <div className="message-box success">
              <strong>{resetData.message}</strong>
              <br />
              Reset Code: <strong>{resetData.resetCode}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid one-column compact-form">
            <div className="form-group">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ email: e.target.value });
                  setErrors({ email: "" });
                }}
                placeholder="Officer Email"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <small className="field-error">{errors.email}</small>}
            </div>

            <button type="submit" className="btn btn-light wide-btn">
              GENERATE CODE
            </button>
          </form>

          <div className="auth-helper-links center-links">
            <Link to="/reset-password">Go to Reset Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;