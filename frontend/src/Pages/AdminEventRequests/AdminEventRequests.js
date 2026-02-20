// src/pages/AdminPendingEvents.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminEventRequests.css'

const AdminPendingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/events/pending")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const approve = (id) => {
    axios.put(`http://localhost:8080/api/admin/events/approve/${id}`)
      .then(() => setEvents(events.filter(e => e.id !== id)))
      .catch(err => alert("Slot unavailable or error"));
  };

  const reject = (id) => {
    const msg = prompt("Enter rejection reason:");
    if (!msg) return;
    axios.put(`http://localhost:8080/api/admin/events/reject/${id}?message=${encodeURIComponent(msg)}`)
      .then(() => setEvents(events.filter(e => e.id !== id)))
      .catch(err => console.error(err));
  };

  return (
  <div className="admin-events-scope">
    <div className="admin-events-container">
      <h2 className="admin-events-title">Pending Event Requests</h2>

      {events.map(event => (
  <div key={event.id} className="admin-event-card">

    <h3>{event.eventName}</h3>

    <p><strong>Date:</strong> {event.eventDate}</p>
    <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
    <p><strong>Venue:</strong> {event.venue}</p>

    {event.description && (
      <p><strong>Description:</strong> {event.description}</p>
    )}

    <p><strong>Society ID:</strong> {event.societyId}</p>

    <div className="admin-event-actions">
      <button onClick={() => approve(event.id)} className="approve-btn">
        Approve
      </button>

      <button onClick={() => reject(event.id)} className="reject-btn">
        Reject
      </button>
    </div>

  </div>
))}

      {events.length === 0 && <p className="no-events">No pending events</p>}
    </div>
  </div>
);
};

export default AdminPendingEvents;
