import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import artistPortalService from "../services/artistPortalService";
import "./ArtistLogin.css";

function ArtistForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getErrorMessage = (err, fallback = "Something went wrong") => {
    if (typeof err?.response?.data === "string") return err.response.data;
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return fallback;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "New password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must include at least 1 uppercase letter";
    if (!/[a-z]/.test(password)) return "Must include at least 1 lowercase letter";
    if (!/[0-9]/.test(password)) return "Must include at least 1 number";
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\/\[\];'`~+=]/.test(password)) {
      return "Must include at least 1 special character";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleEmailCheck = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const emailError = validateEmail(form.email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      return;
    }

    setFieldErrors({});
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const errors = {};
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) errors.newPassword = passwordError;

    const confirmError = validateConfirmPassword(
      form.newPassword,
      form.confirmPassword
    );
    if (confirmError) errors.confirmPassword = confirmError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await artistPortalService.resetPassword({
        email: form.email.trim(),
        newPassword: form.newPassword,
      });

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Password updated successfully."
      );

      setTimeout(() => navigate("/artist-login"), 1200);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to reset password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="artist-login-page">
      <button
        className="artist-login-back"
        type="button"
        onClick={() => navigate("/artist-login")}
      >
        ← Back to Login
      </button>

      <div className="artist-login-shell">
        <div className="artist-login-panel">
          <p className="artist-login-eyebrow">Artist Portal</p>
          <h1>Forgot password</h1>
          <p className="artist-login-subtitle">
            For now, this flow lets you reset your password using your registered email.
          </p>

          {step === 1 ? (
            <form className="artist-login-form" onSubmit={handleEmailCheck}>
              <div className="artist-login-field">
                <label htmlFor="email">Registered Email</label>
                <input
                  id="email"
                  className={fieldErrors.email ? "has-error" : ""}
                  name="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.email;
                      return next;
                    });
                    setError("");
                  }}
                  autoComplete="email"
                  required
                />
                {fieldErrors.email && (
                  <p className="field-error">{fieldErrors.email}</p>
                )}
              </div>

              <button className="artist-login-button" type="submit">
                Continue
              </button>
            </form>
          ) : (
            <form className="artist-login-form" onSubmit={handleReset}>
              <div className="artist-login-field">
                <label htmlFor="newPassword">New Password</label>
                <div className="artist-password-wrap">
                  <input
                    id="newPassword"
                    className={fieldErrors.newPassword ? "has-error" : ""}
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create a new password"
                    value={form.newPassword}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }));
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.newPassword;
                        return next;
                      });
                      setError("");
                    }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="artist-password-toggle"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <p className="field-error">{fieldErrors.newPassword}</p>
                )}
              </div>

              <div className="artist-login-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="artist-password-wrap">
                  <input
                    id="confirmPassword"
                    className={fieldErrors.confirmPassword ? "has-error" : ""}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }));
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.confirmPassword;
                        return next;
                      });
                      setError("");
                    }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="artist-password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="field-error">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                className="artist-login-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Updating password..." : "Reset Password"}
              </button>
            </form>
          )}

          {message && <p className="artist-register-success">{message}</p>}
          {error && <p className="artist-login-error">{error}</p>}

          <p className="artist-login-switch">
            Remembered your password?
            <span onClick={() => navigate("/artist-login")}> Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArtistForgotPassword;