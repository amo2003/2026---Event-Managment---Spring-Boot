import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./EventDetail.css";
import defaultImg from "../../assets/m4.jpg";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/public/events/${id}`);
        setEvent(res.data);

        // Fetch related society
        if (res.data.societyId) {
          try {
            const sRes = await axios.get(`http://localhost:8080/api/society/profile/${res.data.societyId}`);
            setSociety(sRes.data);
          } catch {
            // fallback to event.societyName
          }
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const getEventImage = () =>
    event?.imageUrl ? `http://localhost:8080/images/events/${event.imageUrl}` : defaultImg;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${minutes} ${ampm}`;
  };

  const statusColor = { active: "#22c55e", upcoming: "#3b82f6", completed: "#64748b" };

  if (loading) return (
    <div className="ed-page">
      <button className="ed-back-btn" onClick={() => navigate(-1)}>←</button>
      <div className="ed-loading">Loading event details...</div>
    </div>
  );

  if (!event) return (
    <div className="ed-page">
      <button className="ed-back-btn" onClick={() => navigate(-1)}>←</button>
      <div className="ed-loading">Event not found.</div>
    </div>
  );

  const societyName = society?.societyName || event.societyName || "Unknown Society";

  return (
    <div className="ed-page">
      <button className="ed-back-btn" onClick={() => navigate(-1)}>←</button>

      <div className="ed-container">

        {/* ── Hero ── */}
        <div className="ed-hero">
          <img src={getEventImage()} alt={event.eventName} className="ed-hero-img" />
          <div className="ed-hero-overlay">
            <span
              className="ed-status-badge"
              style={{ background: statusColor[event.status?.toLowerCase()] || "#64748b" }}
            >
              {event.status}
            </span>
            <h1 className="ed-hero-title">{event.eventName}</h1>
            <p className="ed-hero-society">Organized by {societyName}</p>
          </div>
        </div>

        <div className="ed-body">

          {/* ── Quick Info Strip ── */}
          <div className="ed-info-strip">
            <div className="ed-info-item">
              <span className="ed-info-icon">📅</span>
              <div>
                <span className="ed-info-label">Date</span>
                <span className="ed-info-value">{formatDate(event.eventDate)}</span>
              </div>
            </div>
            <div className="ed-strip-divider" />
            <div className="ed-info-item">
              <span className="ed-info-icon">🕐</span>
              <div>
                <span className="ed-info-label">Time</span>
                <span className="ed-info-value">{formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
              </div>
            </div>
            <div className="ed-strip-divider" />
            <div className="ed-info-item">
              <span className="ed-info-icon">📍</span>
              <div>
                <span className="ed-info-label">Venue</span>
                <span className="ed-info-value">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          {event.description && (
            <div className="ed-card">
              <h2 className="ed-card-title">About This Event</h2>
              <p className="ed-description">{event.description}</p>
            </div>
          )}

          {/* ── Stall Opportunities ── */}
          <div className="ed-card ed-stall-card">
            <div className="ed-stall-text">
              <h2 className="ed-card-title">🏪 Stall Opportunities</h2>
              <p className="ed-stall-desc">Interested in setting up a stall at this event? Apply now to secure your spot.</p>
            </div>
            <button
              className="ed-apply-btn"
              onClick={() => {
                if (user && user.userType === "stallOwner") {
                  navigate(`/stall-application/${user.id}/${event.id}`);
                } else {
                  navigate("/slogin", { state: { eventId: event.id } });
                }
              }}
            >
              {user && user.userType === "stallOwner" ? "Apply for Stall →" : "Login to Apply →"}
            </button>
          </div>

          {/* ── Friend Tracker ── */}
          <div className="ed-card ed-friend-card">
            <div className="ed-stall-text">
              <h2 className="ed-card-title">👥 Friend Tracker</h2>
              <p className="ed-stall-desc">Find and connect with friends attending this event. Track who's going and meet up on the day.</p>
            </div>
            <button
              className="ed-friend-btn"
              onClick={() => navigate("/friend-tracker")}
            >
              Open Friend Tracker →
            </button>
          </div>

          {/* ── Risk Management ── */}
          <div className="ed-card ed-risk-card">
            <div className="ed-stall-text">
              <h2 className="ed-card-title">⚠️ Risk Management</h2>
              <p className="ed-stall-desc">Report or track safety incidents related to this event. Help keep the event safe for everyone.</p>
            </div>
            <button
              className="ed-risk-btn"
              onClick={() => navigate("/riskhome-page")}
            >
              Open Risk Portal →
            </button>
          </div>

          {/* ── Organizer ── */}
          <div className="ed-card">
            <h2 className="ed-card-title">About the Organizer</h2>
            <div className="ed-organizer-card" >
              <div className="ed-organizer-avatar">
                {societyName.charAt(0).toUpperCase()}
              </div>
              <div className="ed-organizer-info">
                <span className="ed-organizer-name">{societyName}</span>
                <span className="ed-organizer-sub"> Society</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
