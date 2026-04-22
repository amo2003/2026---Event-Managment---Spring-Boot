import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import artistPortalService from "../services/artistPortalService";
import "./ArtistRegister.css";

function ArtistRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    if (!password) return "Password is required";
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

  const validateForm = () => {
    const errors = {};

    const emailError = validateEmail(form.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) errors.password = passwordError;

    const confirmError = validateConfirmPassword(
      form.password,
      form.confirmPassword
    );
    if (confirmError) errors.confirmPassword = confirmError;

    return errors;
  };

  const passwordChecks = useMemo(() => {
    const password = form.password || "";
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>_\-\\/\[\];'`~+=]/.test(password),
    };
  }, [form.password]);

  const passwordStrength = useMemo(() => {
    const score = Object.values(passwordChecks).filter(Boolean).length;
    if (!form.password) return { label: "Enter a password", level: 0 };
    if (score <= 2) return { label: "Weak", level: 1 };
    if (score <= 4) return { label: "Medium", level: 2 };
    return { label: "Strong", level: 3 };
  }, [passwordChecks, form.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
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

        const confirmError = validateConfirmPassword(value, form.confirmPassword);
        if (confirmError) next.confirmPassword = confirmError;
        else delete next.confirmPassword;
      }

      if (name === "confirmPassword") {
        const confirmError = validateConfirmPassword(form.password, value);
        if (confirmError) next.confirmPassword = confirmError;
        else delete next.confirmPassword;
      }

      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await artistPortalService.register({
        email: form.email.trim(),
        password: form.password,
      });

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Artist account created successfully."
      );

      setTimeout(() => navigate("/artist-login"), 1000);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to register"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="artist-register-page">
      <button
        className="artist-register-back"
        type="button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="artist-register-shell">
        <div className="artist-register-panel">
          <p className="artist-register-eyebrow">Artist Portal</p>
          <h1>Create your account</h1>
          <p className="artist-register-subtitle">
            Register to access your assigned event details and submit feedback
            after your performance.
          </p>

          <form className="artist-register-form" onSubmit={handleSubmit}>
            <div className="artist-register-field">
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

            <div className="artist-register-field">
              <label htmlFor="password">Password</label>

              <div className="artist-password-wrap">
                <input
                  id="password"
                  className={fieldErrors.password ? "has-error" : ""}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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

              <p className="password-hint">
                Use 8+ characters with uppercase, lowercase, number, and special
                character.
              </p>

              <div className="password-strength">
                <div className="password-strength-track">
                  <div
                    className={`password-strength-fill level-${passwordStrength.level}`}
                  />
                </div>
                <span className={`password-strength-label level-${passwordStrength.level}`}>
                  {passwordStrength.label}
                </span>
              </div>

              <div className="password-checklist">
                <div className={passwordChecks.length ? "met" : ""}>8+ characters</div>
                <div className={passwordChecks.uppercase ? "met" : ""}>Uppercase letter</div>
                <div className={passwordChecks.lowercase ? "met" : ""}>Lowercase letter</div>
                <div className={passwordChecks.number ? "met" : ""}>Number</div>
                <div className={passwordChecks.special ? "met" : ""}>Special character</div>
              </div>

              {fieldErrors.password && (
                <p className="field-error">{fieldErrors.password}</p>
              )}
            </div>

            <div className="artist-register-field">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <div className="artist-password-wrap">
                <input
                  id="confirmPassword"
                  className={fieldErrors.confirmPassword ? "has-error" : ""}
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
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
              className="artist-register-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {message && <p className="artist-register-success">{message}</p>}
          {error && <p className="artist-register-error">{error}</p>}

          <p className="artist-register-switch">
            Already have an account?
            <span onClick={() => navigate("/artist-login")}> Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArtistRegister;