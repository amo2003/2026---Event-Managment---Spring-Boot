import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import artistPortalService from "../services/artistPortalService";
import "./ArtistPortal.css";

function ArtistPortalDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getErrorMessage = (err, fallback = "Something went wrong") => {
    if (typeof err?.response?.data === "string") return err.response.data;
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return fallback;
  };

  useEffect(() => {
    const stored = localStorage.getItem("artistPortalUser");

    if (!stored) {
      navigate("/artist-login");
      return;
    }

    const parsed = JSON.parse(stored);

    artistPortalService
      .getDashboard(parsed.artistId)
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err, "Failed to load dashboard")));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("artistPortalUser");
    navigate("/artist-login");
  };

  const handleCalendarClick = (e) => {
    if (!data?.assignedEvent?.invitationId) {
      e.preventDefault();
      alert("Calendar file is not available yet because the invitation ID is missing.");
    }
  };

  const formatGoogleDate = (date) => {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const hh = String(date.getUTCHours()).padStart(2, "0");
    const mi = String(date.getUTCMinutes()).padStart(2, "0");
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
    return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
  };

  const googleCalendarUrl = useMemo(() => {
    if (!data?.assignedEvent?.eventName || !data?.assignedEvent?.eventDateTime) {
      return "#";
    }

    const start = new Date(data.assignedEvent.eventDateTime);
    if (Number.isNaN(start.getTime())) {
      return "#";
    }

    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: data.assignedEvent.eventName || "Artist Event",
      dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
      location: data.assignedEvent.venue || "",
      details: data.assignedEvent.organizerMessage || "Artist performance event",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [data]);

  if (error) {
    return (
      <div className="artist-portal-page">
        <div className="artist-dashboard-shell">
          <div className="artist-portal-card artist-dashboard-error-card">
            <h1>Artist Dashboard</h1>
            <p className="error">{error}</p>
            <button onClick={() => navigate("/artist-login")}>Back to Login</button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="artist-portal-page">
        <div className="artist-dashboard-shell">
          <div className="artist-portal-card artist-dashboard-loading-card">
            <div className="artist-dashboard-loader-circle">◌</div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const initials = (data.artistName || "A")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const calendarHref = data.assignedEvent?.invitationId
    ? `http://localhost:8080/api/artist-portal/calendar-file/invitation/${data.assignedEvent.invitationId}`
    : "#";

  return (
    <div className="artist-portal-page">
      <div className="artist-dashboard-shell">
        <section className="artist-dashboard-hero">
          <div>
            <p className="artist-dashboard-kicker">ARTIST PORTAL</p>
            <h1>Welcome back, {data.artistName}</h1>
            <p className="artist-dashboard-subtitle">
              View your event assignment, account status, and submit your feedback
              after the performance.
            </p>
          </div>

          <button
            className="artist-dashboard-logout-btn"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </section>

        <div className="artist-dashboard-grid">
          <div className="artist-portal-card artist-dashboard-profile-card">
            <div className="artist-dashboard-profile-top">
              <div className="artist-dashboard-avatar">{initials}</div>

              <div className="artist-dashboard-profile-meta">
                <h2>{data.artistName}</h2>
                <p>{data.email}</p>
              </div>

              <span
                className={`artist-dashboard-status-badge ${
                  data.active ? "active" : "inactive"
                }`}
              >
                {data.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="artist-dashboard-info-grid">
              <div className="artist-dashboard-info-item">
                <span className="artist-dashboard-label">Category</span>
                <span className="artist-dashboard-value">
                  {data.category || "Not assigned"}
                </span>
              </div>

              <div className="artist-dashboard-info-item">
                <span className="artist-dashboard-label">Feedback Status</span>
                <span className="artist-dashboard-value">
                  {data.feedbackSubmitted ? "Submitted" : "Pending"}
                </span>
              </div>

              <div className="artist-dashboard-info-item">
                <span className="artist-dashboard-label">Artist ID</span>
                <span className="artist-dashboard-value">{data.artistId}</span>
              </div>

              <div className="artist-dashboard-info-item">
                <span className="artist-dashboard-label">Account</span>
                <span className="artist-dashboard-value">
                  {data.active ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          <div className="artist-portal-card artist-dashboard-event-card">
            <div className="artist-dashboard-section-head">
              <div>
                <p className="artist-dashboard-kicker">ASSIGNED EVENT</p>
                <h2>Your Performance Details</h2>
              </div>
            </div>

            {data.assignedEvent ? (
              <>
                <div className="artist-dashboard-event-highlight">
                  <div>
                    <p className="artist-dashboard-label">Event Name</p>
                    <h3>{data.assignedEvent.eventName}</h3>
                  </div>
                </div>

                <div className="artist-dashboard-info-stack">
                  <div className="artist-dashboard-row">
                    <span className="artist-dashboard-label">Venue</span>
                    <span className="artist-dashboard-value">
                      {data.assignedEvent.venue || "N/A"}
                    </span>
                  </div>

                  <div className="artist-dashboard-row">
                    <span className="artist-dashboard-label">Date & Time</span>
                    <span className="artist-dashboard-value">
                      {data.assignedEvent.eventDateTime || "N/A"}
                    </span>
                  </div>

                  <div className="artist-dashboard-row">
                    <span className="artist-dashboard-label">Organizer Message</span>
                    <span className="artist-dashboard-value artist-dashboard-message">
                      {data.assignedEvent.organizerMessage || "No message provided"}
                    </span>
                  </div>

                  <div className="artist-dashboard-row">
                    <span className="artist-dashboard-label">Invitation ID</span>
                    <span className="artist-dashboard-value">
                      {data.assignedEvent.invitationId ?? "Missing"}
                    </span>
                  </div>
                </div>

                <div className="artist-dashboard-actions">
                  <a
                    className={`artist-dashboard-calendar-btn ${
                      !data.assignedEvent.invitationId ? "disabled" : ""
                    }`}
                    href={calendarHref}
                    onClick={handleCalendarClick}
                  >
                    Add to Calendar
                  </a>

                  <a
                    className={`artist-dashboard-google-btn ${
                      googleCalendarUrl === "#" ? "disabled" : ""
                    }`}
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (googleCalendarUrl === "#") {
                        e.preventDefault();
                        alert("Google Calendar link is not available yet.");
                      }
                    }}
                  >
                    Add to Google Calendar
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/artist-feedback", {
                        state: {
                          artistId: data.artistId,
                          eventId: data.assignedEvent.eventId,
                          eventName: data.assignedEvent.eventName,
                        },
                      })
                    }
                  >
                    Submit Feedback
                  </button>
                </div>
              </>
            ) : (
              <div className="artist-dashboard-empty">
                <div className="artist-dashboard-loader-circle">⊘</div>
                <p>No assigned event found yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistPortalDashboard;