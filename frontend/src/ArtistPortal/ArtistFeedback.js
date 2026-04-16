import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import artistPortalService from "../services/artistPortalService";
import "./ArtistFeedback.css";

function ArtistFeedback() {
  const navigate = useNavigate();
  const location = useLocation();

  const artistId = location.state?.artistId;
  const eventId = location.state?.eventId;
  const eventName = location.state?.eventName || "Assigned Event";

  const [form, setForm] = useState({
    rating: 5,
    comments: "",
    wouldPerformAgain: true,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getErrorMessage = (err, fallback = "Something went wrong") => {
    if (typeof err?.response?.data === "string") return err.response.data;
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return fallback;
  };

  const validateForm = () => {
    const errors = {};

    if (!artistId) {
      errors.general = "Missing artist information. Please log in again.";
    }

    if (!eventId) {
      errors.general = "Missing event information. Please return to your dashboard.";
    }

    if (!form.rating || form.rating < 1 || form.rating > 5) {
      errors.rating = "Rating must be between 1 and 5.";
    }

    if (!form.comments.trim()) {
      errors.comments = "Please share your feedback.";
    } else if (form.comments.trim().length < 10) {
      errors.comments = "Feedback should be at least 10 characters.";
    }

    return errors;
  };

  const ratingLabel = useMemo(() => {
    const value = Number(form.rating);
    if (value <= 1) return "Very poor";
    if (value === 2) return "Needs improvement";
    if (value === 3) return "Average";
    if (value === 4) return "Good";
    return "Excellent";
  }, [form.rating]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setMessage("");
    setError("");

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.general;
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
      const payload = {
        artistId,
        eventId,
        rating: Number(form.rating),
        comments: form.comments.trim(),
        wouldPerformAgain: form.wouldPerformAgain,
      };

      const response = await artistPortalService.submitFeedback(payload);

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Feedback submitted successfully."
      );

      localStorage.removeItem("artistPortalUser");
      setTimeout(() => navigate("/artist-login"), 1500);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to submit feedback"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="artist-feedback-page">
      <button
        className="artist-feedback-back"
        type="button"
        onClick={() => navigate("/artist-portal-dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="artist-feedback-shell">
        <div className="artist-feedback-panel">
          <p className="artist-feedback-eyebrow">Artist Portal</p>
          <h1>Post Event Feedback</h1>
          <p className="artist-feedback-subtitle">
            Share your experience after performing. Once submitted, your account
            may be deactivated based on the event flow.
          </p>

          <div className="artist-feedback-summary">
            <span className="artist-feedback-summary-label">Event</span>
            <strong>{eventName}</strong>
          </div>

          <form className="artist-feedback-form" onSubmit={handleSubmit}>
            <div className="artist-feedback-field">
              <div className="artist-feedback-label-row">
                <label htmlFor="rating">Overall Rating</label>
                <span className="artist-feedback-rating-text">{ratingLabel}</span>
              </div>

              <div className="artist-feedback-rating-wrap">
                <input
                  id="rating"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={form.rating}
                  onChange={(e) => handleChange("rating", e.target.value)}
                />
                <div className="artist-feedback-rating-scale">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              {fieldErrors.rating && (
                <p className="artist-feedback-field-error">{fieldErrors.rating}</p>
              )}
            </div>

            <div className="artist-feedback-field">
              <label htmlFor="comments">Your Feedback</label>
              <textarea
                id="comments"
                className={fieldErrors.comments ? "has-error" : ""}
                placeholder="Tell us about your experience, event organization, communication, timing, and anything that could be improved."
                value={form.comments}
                onChange={(e) => handleChange("comments", e.target.value)}
              />
              <div className="artist-feedback-meta-row">
                <span className="artist-feedback-hint">
                  Be honest and specific. This helps improve future events.
                </span>
                <span className="artist-feedback-count">
                  {form.comments.trim().length} chars
                </span>
              </div>
              {fieldErrors.comments && (
                <p className="artist-feedback-field-error">{fieldErrors.comments}</p>
              )}
            </div>

            <div className="artist-feedback-check">
              <label className="artist-feedback-check-label">
                <input
                  type="checkbox"
                  checked={form.wouldPerformAgain}
                  onChange={(e) =>
                    handleChange("wouldPerformAgain", e.target.checked)
                  }
                />
                <span>I would be happy to perform again for future events</span>
              </label>
            </div>

            {fieldErrors.general && (
              <p className="artist-feedback-field-error">{fieldErrors.general}</p>
            )}

            <button
              className="artist-feedback-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>

          {message && <p className="artist-feedback-success">{message}</p>}
          {error && <p className="artist-feedback-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ArtistFeedback;