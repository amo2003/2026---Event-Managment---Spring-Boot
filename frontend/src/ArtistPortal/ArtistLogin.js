import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import artistPortalService from "../services/artistPortalService";
import "./ArtistLogin.css";

function ArtistLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    if (!password) return "Password is required";
    return "";
  };

  const validateForm = () => {
    const errors = {};

    const emailError = validateEmail(form.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");

    setFieldErrors((prev) => {
      const next = { ...prev };

      if (name === "email") {
        const emailError = validateEmail(value);
        if (emailError) next.email = emailError;
        else delete next.email;
      }

      if (name === "password") {
        const passwordError = validatePassword(value);
        if (passwordError) next.password = passwordError;
        else delete next.password;
      }

      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await artistPortalService.login({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("artistPortalUser", JSON.stringify(response.data));
      navigate("/artist-portal-dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="artist-login-page">
      <button
        className="artist-login-back"
        type="button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="artist-login-shell">
        <div className="artist-login-panel">
          <p className="artist-login-eyebrow">Artist Portal</p>
          <h1>Welcome back</h1>
          <p className="artist-login-subtitle">
            Log in to view your assigned event details and submit post-event feedback.
          </p>

          <form className="artist-login-form" onSubmit={handleSubmit}>
            <div className="artist-login-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className={fieldErrors.email ? "has-error" : ""}
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              {fieldErrors.email && (
                <p className="field-error">{fieldErrors.email}</p>
              )}
            </div>

            <div className="artist-login-field">
              <div className="artist-login-label-row">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="artist-login-link"
                  onClick={() => navigate("/artist-forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="artist-password-wrap">
                <input
                  id="password"
                  className={fieldErrors.password ? "has-error" : ""}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="artist-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="field-error">{fieldErrors.password}</p>
              )}
            </div>

            <button
              className="artist-login-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className="artist-login-error">{error}</p>}

          <p className="artist-login-switch">
            Don’t have an account?
            <span onClick={() => navigate("/artist-register")}> Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArtistLogin;