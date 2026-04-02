import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { validateResetPasswordForm } from "../utils/validation";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationErrors = validateResetPasswordForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await resetPassword(form);
      setMessage(response || "Password reset successfully");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="auth-scene">
      <div className="auth-back-link">
        <Link to="/login">← Back</Link>
      </div>

      <div className="auth-center-wrap">
        <div className="auth-panel mono">
          <h2>RESET PASSWORD</h2>

          {error && <div className="message-box error">{error}</div>}
          {message && <div className="message-box success">{message}</div>}

          <form onSubmit={handleSubmit} className="form-grid one-column compact-form">
            <div className="form-group">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                placeholder="Officer Email"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <small className="field-error">{errors.email}</small>}
            </div>

            <div className="form-group">
              <input
                value={form.resetCode}
                onChange={(e) => {
                  setForm({ ...form, resetCode: e.target.value });
                  setErrors({ ...errors, resetCode: "" });
                }}
                placeholder="Reset Code"
                className={errors.resetCode ? "input-error" : ""}
              />
              {errors.resetCode && <small className="field-error">{errors.resetCode}</small>}
            </div>

            <div className="form-group">
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => {
                  setForm({ ...form, newPassword: e.target.value });
                  setErrors({ ...errors, newPassword: "" });
                }}
                placeholder="New Password"
                className={errors.newPassword ? "input-error" : ""}
              />
              {errors.newPassword && <small className="field-error">{errors.newPassword}</small>}
            </div>

            <div className="form-group">
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                  setErrors({ ...errors, confirmPassword: "" });
                }}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {errors.confirmPassword && (
                <small className="field-error">{errors.confirmPassword}</small>
              )}
            </div>

            <button type="submit" className="btn btn-light wide-btn">
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;