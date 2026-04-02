import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SocietyProfile.css";
import ChatPanel from "../../components/ChatPanel/ChatPanel";
import useUnreadCounts from "../../components/ChatPanel/useUnreadCounts";

const SocietyProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [chatEventId, setChatEventId] = useState(null);
  const navigate = useNavigate();

  const eventIds = events.map(e => e.id);
  const { unreadMap, clearUnread } = useUnreadCounts(eventIds, "SOCIETY");

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/api/society/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => {
        alert("Failed to load profile. Please login again.");
        logout();
        navigate("/login");
      });

    axios
      .get(`http://localhost:8080/api/society/events/my/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, [user, navigate, logout]);

  if (!user) return <div>Loading user info...</div>;
  if (!profile) return <div>Loading profile...</div>;

  const handleUpdate = () => {
    const errors = {};
    if (!profile.name?.trim())          errors.name = "Society name is required.";
    if (!profile.presidentName?.trim()) errors.presidentName = "President name is required.";
    if (!profile.email?.trim())         errors.email = "Email is required.";
    if (!profile.advisorName?.trim())   errors.advisorName = "Advisor name is required.";

    if (!profile.password?.trim()) {
      errors.password = "Password is required.";
    } else if (profile.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!profile.contactNumber?.trim()) {
      errors.contactNumber = "Contact number is required.";
    } else if (profile.contactNumber.length !== 10) {
      errors.contactNumber = "Contact number must be exactly 10 digits.";
    }

    if (!profile.pinCode?.trim()) {
      errors.pinCode = "Pin code is required.";
    } else if (!profile.pinCode.startsWith("SOC-")) {
      errors.pinCode = "Pin code must need to start with 'SOC-'.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const token = localStorage.getItem("token");
    axios
      .post(`http://localhost:8080/api/society/profile/${profile.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setEditMode(false);
        setFieldErrors({});
        alert("Profile updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/api/society/delete/${profile.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Profile deleted!");
        logout();
        navigate("/login");
      })
      .catch((err) => console.error(err));
  };

  const handleEventDelete = (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/api/society/events/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setEvents(events.filter((event) => event.id !== eventId));
        alert("Event deleted successfully!");
      })
      .catch(() => alert("Failed to delete event."));
  };

  const handleChange = (field, value) => {
    // Validation rules
    if (field === "name" || field === "presidentName" || field === "advisorName") {
      if (/\d/.test(value)) return; // prevent numbers
    } else if (field === "contactNumber") {
      if (/[^0-9]/.test(value)) return;
      if (value.length > 10) return;
    }
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="society-profile-page">
      <h1>Society Profile</h1>
      <button className="sp-back-btn" onClick={() => navigate(-1)}>✕</button>

      <div className="sp-profile-card">
        {editMode ? (
          <div className="sp-edit-form">
            <label>Society Name:</label>
            <input
              value={profile.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {fieldErrors.name && <span className="sp-field-error">{fieldErrors.name}</span>}

            <label>Faculty:</label>
            <input value={profile.faculty || ""} disabled />

            <label>President Name:</label>
            <input
              value={profile.presidentName || ""}
              onChange={(e) => handleChange("presidentName", e.target.value)}
            />
            {fieldErrors.presidentName && <span className="sp-field-error">{fieldErrors.presidentName}</span>}

            <label>Email:</label>
            <input
              value={profile.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {fieldErrors.email && <span className="sp-field-error">{fieldErrors.email}</span>}

            <label>Password:</label>
            <input
              type="text"
              value={profile.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {fieldErrors.password && <span className="sp-field-error">{fieldErrors.password}</span>}

            <label>Contact Number:</label>
            <input
              value={profile.contactNumber || ""}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
            />
            {fieldErrors.contactNumber && <span className="sp-field-error">{fieldErrors.contactNumber}</span>}

            <label>Advisor Name:</label>
            <input
              value={profile.advisorName || ""}
              onChange={(e) => handleChange("advisorName", e.target.value)}
            />
            {fieldErrors.advisorName && <span className="sp-field-error">{fieldErrors.advisorName}</span>}

            <label>PIN Code:</label>
            <input
              value={profile.pinCode || ""}
              onChange={(e) => handleChange("pinCode", e.target.value)}
            />
            {fieldErrors.pinCode && <span className="sp-field-error">{fieldErrors.pinCode}</span>}

            <div className="sp-profile-btns">
              <button className="sp-btn-edit" onClick={handleUpdate}>Save</button>
              <button className="sp-btn-danger" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="sp-profile-details">
            <p><strong>Society ID:</strong> {profile.id}</p>
            <p><strong>Society Name:</strong> {profile.name}</p>
            <p><strong>Faculty:</strong> {profile.faculty}</p>
            <p><strong>President:</strong> {profile.presidentName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Contact:</strong> {profile.contactNumber}</p>
            <p><strong>Advisor:</strong> {profile.advisorName}</p>
            <p><strong>PIN:</strong> {profile.pinCode}</p>

            <div className="sp-profile-btns">
              <button className="sp-btn-edit" onClick={() => setEditMode(true)}>Edit Profile</button>
              <button className="sp-btn-danger" onClick={handleDelete}>Delete Profile</button>
            </div>
          </div>
        )}
      </div>

      {/* EVENTS SECTION */}
      <div className="sp-events-section">
        <h2>My Created Events</h2>
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <div className="sp-events-grid">
          {events.map(event => (
            <div key={event.id} className="sp-event-card">
              {event.imageUrl && (
                <img
                  src={`http://localhost:8080/images/events/${event.imageUrl}`}
                  alt={event.eventName}
                  className="sp-event-img"
                  onClick={() => setModalImage(`http://localhost:8080/images/events/${event.imageUrl}`)}
                />
              )}
              <div className="sp-event-body">
                <h4 className="sp-event-title">{event.eventName}</h4>
                <div className="sp-event-meta">
                  <div className="sp-event-meta-item">
                    <span className="sp-event-meta-label">Date</span>
                    <span className="sp-event-meta-value">{event.eventDate}</span>
                  </div>
                  <div className="sp-event-meta-item">
                    <span className="sp-event-meta-label">Time</span>
                    <span className="sp-event-meta-value">{event.startTime} – {event.endTime}</span>
                  </div>
                  <div className="sp-event-meta-item">
                    <span className="sp-event-meta-label">Venue</span>
                    <span className="sp-event-meta-value">{event.venue}</span>
                  </div>
                  {event.description && (
                    <div className="sp-event-meta-item sp-event-meta-full">
                      <span className="sp-event-meta-label">Description</span>
                      <span className="sp-event-meta-value">{event.description}</span>
                    </div>
                  )}
                </div>
                <div className="sp-event-actions">
                  {event.status === "PENDING" && <span className="sp-badge sp-badge-pending">⏳ Waiting for Approval</span>}
                  {event.status === "REJECTED" && <span className="sp-badge sp-badge-rejected">❌ Rejected - {event.adminMessage}</span>}
                  {event.status === "CONFIRMED" && <span className="sp-badge sp-badge-confirmed">Scheduled</span>}
                  <button className="sp-btn-delete-event" onClick={() => handleEventDelete(event.id)}>
                    🗑 Delete Event
                  </button>
                  <div className="sp-chat-wrapper">
                    {unreadMap[event.id] > 0 && (
                      <span className="sp-unread-indicator">{unreadMap[event.id]} new message{unreadMap[event.id] > 1 ? "s" : ""}</span>
                    )}
                    <button className="sp-btn-chat-icon" onClick={() => { setChatEventId(event.id); clearUnread(event.id); }} title="Chat with Admin">
                      💬
                      {unreadMap[event.id] > 0 && <span className="sp-chat-dot" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      {/* IMAGE MODAL */}
      {modalImage && (
        <div className="sp-image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Preview" />
        </div>
      )}

      {/* CHAT PANEL */}
      {chatEventId && (
        <ChatPanel
          eventId={chatEventId}
          senderType="SOCIETY"
          senderName={profile?.name || "Society"}
          onClose={() => setChatEventId(null)}
        />
      )}
    </div>
  );
};

export default SocietyProfile;