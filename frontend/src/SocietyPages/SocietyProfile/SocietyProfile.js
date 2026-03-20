// src/pages/SocietyProfile.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SocietyProfile.css";

const SocietyProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [modalImage, setModalImage] = useState(null); // image modal
  const navigate = useNavigate();

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
    const token = localStorage.getItem("token");
    axios
      .post(`http://localhost:8080/api/society/profile/${profile.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setEditMode(false);
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

  return (
    <div className="society-profile-page">
      <h1>Society Profile</h1>
      <button className="back-btn" onClick={() => navigate(-1)}>✕</button>

      <div className="profile-card">
        {editMode ? (
          <div className="edit-form">
            <label>Society Name:</label>
            <input value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

            <label>Faculty:</label>
            <input value={profile.faculty || ""} onChange={(e) => setProfile({ ...profile, faculty: e.target.value })} />

            <label>President Name:</label>
            <input value={profile.presidentName || ""} onChange={(e) => setProfile({ ...profile, presidentName: e.target.value })} />

            <label>Email:</label>
            <input value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />

            <label>Password:</label>
            <input type="password" value={profile.password || ""} onChange={(e) => setProfile({ ...profile, password: e.target.value })} />

            <label>Contact Number:</label>
            <input value={profile.contactNumber || ""} onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })} />

            <label>Advisor Name:</label>
            <input value={profile.advisorName || ""} onChange={(e) => setProfile({ ...profile, advisorName: e.target.value })} />

            <div className="profile-buttons">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Society Name:</strong> {profile.name}</p>
            <p><strong>Faculty:</strong> {profile.faculty}</p>
            <p><strong>President:</strong> {profile.presidentName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Contact:</strong> {profile.contactNumber}</p>
            <p><strong>Advisor:</strong> {profile.advisorName}</p>
            <p><strong>PIN:</strong> {profile.pinCode}</p>

            <div className="profile-buttons">
              <button className="edit" onClick={() => setEditMode(true)}>Edit Profile</button>
              <button onClick={handleDelete}>Delete Profile</button>
            </div>
          </div>
        )}
      </div>

      {/* EVENTS SECTION */}
      <div className="society-events-section">
        <h2>My Created Events</h2>

        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-card">
              <p><strong>Event Name:</strong> {event.eventName}</p>
              <p><strong>Date:</strong> {event.eventDate}</p>
              <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              {event.description && <p><strong>Description:</strong> {event.description}</p>}
              {event.imageUrl && (
                <img
                  src={`http://localhost:8080/images/events/${event.imageUrl}`}
                  alt={event.eventName}
                  className="event-image-preview"
                  onClick={() => setModalImage(`http://localhost:8080/images/events/${event.imageUrl}`)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <p><strong>Status:</strong> {event.status}</p>

              <div className="event-actions">
                {event.status === "PENDING" && <span className="statuss pending">🟡 Waiting for Admin Approval</span>}
                {event.status === "REJECTED" && <span className="statuss rejected">🔴 Rejected - {event.adminMessage}</span>}
                {event.status === "CONFIRMED" && <span className="statuss confirmed">Event Scheduled Successfully</span>}

                <button
                  className="delete-event-btn"
                  onClick={() => handleEventDelete(event.id)}
                >
                  🗑 Delete Event
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* IMAGE MODAL */}
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default SocietyProfile;