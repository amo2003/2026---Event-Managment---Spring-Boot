import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUserApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/validation";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const errors = {};

    if (!loginForm.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(loginForm.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!loginForm.password.trim()) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await loginUserApi(loginForm);
      login(response);
      setErrorMessage("");
      setSuccessMessage("Login successful.");

      if (response.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Login failed.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-top-row">
        <Link to="/" className="login-back-link">
          ← Back to Public Portal
        </Link>
      </div>

      <div className="login-wrapper">
        <div className="login-side-panel">
          <div className="login-side-badge">Authorized Access</div>
          <h1>Operations Portal</h1>
          <p>
            Officer and admin users can securely access incident operations,
            monitoring, and response management from this portal.
          </p>

          <div className="login-side-points">
            <div className="login-point-card">
              <h3>Incident Monitoring</h3>
              <p>Track active incidents and current response progress.</p>
            </div>

            <div className="login-point-card">
              <h3>Protected Access</h3>
              <p>Only authorized operational users can access this area.</p>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign In</h2>
            <p>Enter your account details to continue.</p>
          </div>

          {successMessage && <div className="success-box">{successMessage}</div>}
          {errorMessage && <div className="error-box">{errorMessage}</div>}

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
                className={fieldErrors.email ? "input-error" : ""}
              />
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                className={fieldErrors.password ? "input-error" : ""}
              />
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn auth-main-btn">
                Login to Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;