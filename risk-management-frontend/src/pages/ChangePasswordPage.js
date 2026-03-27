import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { isStrongEnoughPassword } from "../utils/validation";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { completePasswordChange, logout } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    const errors = {};

    if (!formData.currentPassword.trim()) {
      errors.currentPassword = "Current password is required.";
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New password is required.";
    } else if (!isStrongEnoughPassword(formData.newPassword)) {
      errors.newPassword = "Password must be at least 6 characters and include letters and numbers.";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const message = await changePasswordApi(formData);
      completePasswordChange();
      setErrorMessage("");
      setSuccessMessage(message || "Password changed successfully.");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to change password.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-top-row">
        <button
          type="button"
          className="login-back-link"
          onClick={logout}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Logout
        </button>
      </div>

      <div className="login-wrapper">
        <div className="login-side-panel">
          <div className="login-side-badge">Password Update Required</div>
          <h1>Set Your New Password</h1>
          <p>
            Since this is your first login with a temporary password, you must
            create a new password before continuing to the portal.
          </p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Change Password</h2>
            <p>Enter your current temporary password and set a new one.</p>
          </div>

          {successMessage && <div className="success-box">{successMessage}</div>}
          {errorMessage && <div className="error-box">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className={fieldErrors.currentPassword ? "input-error" : ""}
              />
              {fieldErrors.currentPassword && <div className="field-error">{fieldErrors.currentPassword}</div>}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={fieldErrors.newPassword ? "input-error" : ""}
              />
              {fieldErrors.newPassword && <div className="field-error">{fieldErrors.newPassword}</div>}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={fieldErrors.confirmPassword ? "input-error" : ""}
              />
              {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn auth-main-btn">
                Save New Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;