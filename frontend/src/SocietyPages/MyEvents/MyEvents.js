import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyEvents.css";

const MyEventRequests = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [modalImage, setModalImage] = useState(null);
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
    <div className="me-page">
      <button className="me-close-btn" onClick={() => navigate("/")}>✖</button>
      <h2 className="me-title">My Event Requests</h2>

      {events.length === 0 && <p className="me-empty">No event requests found.</p>}

      {events.map((event) => (
        <div key={event.id} className="me-card">
          {event.imageUrl && (
            <img
              src={`http://localhost:8080/images/events/${event.imageUrl}`}
              alt={event.eventName}
              className="me-card-img"
              onClick={() => setModalImage(`http://localhost:8080/images/events/${event.imageUrl}`)}
            />
          )}
          <div className="me-card-body">
            <h3 className="me-card-title">{event.eventName}</h3>
            <div className="me-card-fields">
              <p><strong>Date</strong>{event.eventDate}</p>
              <p><strong>Time</strong>{event.startTime} – {event.endTime}</p>
              <p><strong>Venue</strong>{event.venue}</p>
              {event.description && <p><strong>Description</strong>{event.description}</p>}
            </div>
            <div className="me-card-footer">
              {event.status === "PENDING" && (
                <span className="me-badge me-badge-pending">⏳ Waiting for Admin Approval</span>
              )}
              {event.status === "REJECTED" && (
                <span className="me-badge me-badge-rejected">❌ Rejected — {event.adminMessage || "No message"}</span>
              )}
              {event.status === "CONFIRMED" && (
                <span className="me-badge me-badge-confirmed">✅ Event Scheduled Successfully</span>
              )}
            </div>
          </div>
        </div>
      ))}

      {modalImage && (
        <div className="me-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default MyEventRequests;
