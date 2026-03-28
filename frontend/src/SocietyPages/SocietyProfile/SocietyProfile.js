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

  const handleChange = (field, value) => {
    // Validation rules
    if (field === "name" || field === "presidentName" || field === "advisorName") {
      if (/\d/.test(value)) return; // prevent numbers
    } else if (field === "contactNumber") {
      if (/[^0-9]/.test(value)) return; // prevent letters
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

            <label>Faculty:</label>
            <input
              value={profile.faculty || ""}
              disabled
            />

            <label>President Name:</label>
            <input
              value={profile.presidentName || ""}
              onChange={(e) => handleChange("presidentName", e.target.value)}
            />

            <label>Email:</label>
            <input
              value={profile.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <label>Password:</label>
            <input
              type="text"  // visible password
              value={profile.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <label>Contact Number:</label>
            <input
              value={profile.contactNumber || ""}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
            />

            <label>Advisor Name:</label>
            <input
              value={profile.advisorName || ""}
              onChange={(e) => handleChange("advisorName", e.target.value)}
            />

            <label>PIN Code:</label>
            <input
              value={profile.pinCode || ""}
              onChange={(e) => handleChange("pinCode", e.target.value)}            
            />

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
          events.map(event => (
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
                <p><strong>Event Name:</strong> {event.eventName}</p>
                <p><strong>Date:</strong> {event.eventDate}</p>
                <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                {event.description && <p><strong>Description:</strong> {event.description}</p>}
                <p><strong>Status:</strong> {event.status}</p>
                <div className="sp-event-actions">
                  {event.status === "PENDING" && <span className="sp-badge sp-badge-pending">🟡 Waiting for Admin Approval</span>}
                  {event.status === "REJECTED" && <span className="sp-badge sp-badge-rejected">🔴 Rejected - {event.adminMessage}</span>}
                  {event.status === "CONFIRMED" && <span className="sp-badge sp-badge-confirmed">✅ Scheduled</span>}
                  <button className="sp-btn-delete-event" onClick={() => handleEventDelete(event.id)}>
                    🗑 Delete Event
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* IMAGE MODAL */}
      {modalImage && (
        <div className="sp-image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default SocietyProfile;