import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SocietyForgotPassword.css";

const STEPS = { EMAIL: 1, OTP: 2, PASSWORD: 3 };

const SocietyForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(60);
    const t = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; });
    }, 1000);
  };

  // STEP 1 — send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/society/send-otp", { email });
      setStep(STEPS.OTP);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data || "Email not found.");
    } finally { setLoading(false); }
  };

  // STEP 2 — verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    // Just move to step 3 — actual verify+reset happens on final submit
    setStep(STEPS.PASSWORD);
  };

  // STEP 3 — reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword) { setError("Password is required."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/society/verify-otp-reset", {
        email, otp, password: newPassword
      });
      setStep("done");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data || "Reset failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    try {
      await axios.post("http://localhost:8080/api/society/send-otp", { email });
      startResendTimer();
    } catch { setError("Failed to resend OTP."); }
  };

  return (
    <div className="sfp-page">
      <button className="sfp-back-btn" onClick={() => navigate("/login")}>←</button>

      <div className="sfp-container">
        {/* Progress */}
        <div className="sfp-steps">
          {[1,2,3].map(n => (
            <div key={n} className={`sfp-step ${step >= n ? "sfp-step--active" : ""} ${step > n ? "sfp-step--done" : ""}`}>
              <div className="sfp-step-circle">{step > n ? "✓" : n}</div>
              <span>{n === 1 ? "Email" : n === 2 ? "OTP" : "Password"}</span>
            </div>
          ))}
        </div>

        <h1 className="sfp-title">
          {step === STEPS.EMAIL && "Forgot Password"}
          {step === STEPS.OTP && "Enter OTP"}
          {step === STEPS.PASSWORD && "New Password"}
          {step === "done" && "Password Reset!"}
        </h1>

        {error && <p className="sfp-error-msg">{error}</p>}

        {/* STEP 1 */}
        {step === STEPS.EMAIL && (
          <form onSubmit={handleSendOtp} className="sfp-form">
            <p className="sfp-hint">Enter your registered email and we'll send you a 6-digit OTP.</p>
            <div className="sfp-form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="sfp-reset-btn" disabled={loading}>
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === STEPS.OTP && (
          <form onSubmit={handleVerifyOtp} className="sfp-form">
            <p className="sfp-hint">A 6-digit OTP was sent to <strong>{email}</strong>. Valid for 10 minutes.</p>
            <div className="sfp-form-group">
              <label>OTP Code</label>
              <input
                className="sfp-otp-input"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <button type="submit" className="sfp-reset-btn" disabled={loading}>
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
            <button type="button" className="sfp-resend-btn" onClick={handleResend} disabled={resendTimer > 0}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === STEPS.PASSWORD && (
          <form onSubmit={handleReset} className="sfp-form">
            <p className="sfp-hint">OTP verified. Set your new password.</p>
            <div className="sfp-form-group">
              <label>New Password</label>
              <input type="password" placeholder="Min 6 characters" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="sfp-form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="sfp-reset-btn" disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        {/* DONE */}
        {step === "done" && (
          <div className="sfp-done">
            <div className="sfp-done-icon">✅</div>
            <p>Password reset successfully! Redirecting to login…</p>
          </div>
        )}

        <p className="sfp-back-to-login">
          Remember your password? <span onClick={() => navigate("/login")}>Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default SocietyForgotPassword;
