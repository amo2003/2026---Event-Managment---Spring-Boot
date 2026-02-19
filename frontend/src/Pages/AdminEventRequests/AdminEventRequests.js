// src/pages/AdminPendingEvents.js
import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="admin-events-page">
      <h2>Pending Event Requests</h2>
      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.eventName}</h3>
          <p>{event.eventDate} | {event.venue}</p>
          <button onClick={() => approve(event.id)}>Approve</button>
          <button onClick={() => reject(event.id)}>Reject</button>
        </div>
      ))}
      {events.length === 0 && <p>No pending events</p>}
    </div>
  );
};

export default AdminPendingEvents;
