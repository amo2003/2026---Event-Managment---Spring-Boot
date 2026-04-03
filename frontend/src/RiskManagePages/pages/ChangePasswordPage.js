import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateChangePasswordForm } from "../utils/validation";

const ChangePasswordPage = () => {
  const { completePasswordChange } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
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

    const validationErrors = validateChangePasswordForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await completePasswordChange(form);
      setMessage(response || "Password changed successfully");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card single-card">
        <h2>Change Password</h2>
        <p className="auth-subtext">Update your password to continue.</p>

        {error && <div className="message-box error">{error}</div>}
        {message && <div className="message-box success">{message}</div>}

        <form onSubmit={handleSubmit} className="form-grid one-column">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => {
                setForm({ ...form, currentPassword: e.target.value });
                setErrors({ ...errors, currentPassword: "" });
              }}
              className={errors.currentPassword ? "input-error" : ""}
            />
            {errors.currentPassword && (
              <small className="field-error">{errors.currentPassword}</small>
            )}
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => {
                setForm({ ...form, newPassword: e.target.value });
                setErrors({ ...errors, newPassword: "" });
              }}
              className={errors.newPassword ? "input-error" : ""}
            />
            {errors.newPassword && (
              <small className="field-error">{errors.newPassword}</small>
            )}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm({ ...form, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: "" });
              }}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <small className="field-error">{errors.confirmPassword}</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;