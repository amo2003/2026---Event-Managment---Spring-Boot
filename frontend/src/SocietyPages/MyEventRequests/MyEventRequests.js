// src/pages/MyEventRequests.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyEventRequests.css";

const MyEventRequests = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:8080/api/society/events/my/${user.id}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="my-events-page">
      <button className="close-btn" onClick={() => navigate("/")}>
        ✖
      </button>

      <h2>My Event Requests</h2>

      {events.length === 0 && <p>No event requests found</p>}

      {events.map((event) => (
        <div key={event.id} className="event-card">
          <h3>{event.eventName}</h3>
          <p><strong>Date:</strong> {event.eventDate}</p>
          <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          {event.description && <p><strong>Description:</strong> {event.description}</p>}

          {event.status === "PENDING" && (
            <div style={{ color: "orange" }}>⏳ Waiting for Admin Approval</div>
          )}

          {event.status === "REJECTED" && (
            <div style={{ color: "red" }}>❌ Rejected - {event.adminMessage}</div>
          )}

          {event.status === "CONFIRMED" && (
            <div style={{ color: "green" }}>✅ Event Scheduled Successfully</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyEventRequests;