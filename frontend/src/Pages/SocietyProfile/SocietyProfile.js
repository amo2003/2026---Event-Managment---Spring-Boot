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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");

    // Fetch profile
    axios
      .get(`http://localhost:8080/api/society/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load profile. Please login again.");
        logout();
        navigate("/login");
      });

    // Fetch society events
    axios
      .get(`http://localhost:8080/api/society/events/my/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, [user, navigate, logout]);

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
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  if (!profile) return <div>Loading profile...</div>;

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

              {/* FULL DETAILS */}
              <p><strong>Event Name:</strong> {event.eventName}</p>
              <p><strong>Date:</strong> {event.eventDate}</p>
              <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              {event.description && <p><strong>Description:</strong> {event.description}</p>}
              <p><strong>Society ID:</strong> {event.societyId}</p>
              <p><strong>Status:</strong> {event.status}</p>

              {/* ACTIONS */}
              <div className="event-actions">
                {event.status === "PENDING" && <span className="status pending">🟡 Waiting for Admin Approval</span>}
                {event.status === "REJECTED" && <span className="status rejected">🔴 Rejected - {event.adminMessage}</span>}
                {event.status === "APPROVED" && <span className="status approved">🟢 Approved</span>}
                {event.status === "APPROVED_PAYMENT_PENDING" && (
                  <button className="payment-btn" onClick={() => navigate(`/event-payment/${event.id}`)}>💳 Proceed to Payment</button>
                )}
                {event.status === "CONFIRMED" && <span className="status confirmed">✅ Payment Completed</span>}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocietyProfile;