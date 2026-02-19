// src/pages/MyEventRequests.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyEventRequests = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/society/events/my/${user.id}`)
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, [user]);

  const handlePayment = (eventId) => {
    navigate(`/event-payment/${eventId}`);
  };

  return (
    <div className="my-events-page">
      <h2>My Event Requests</h2>
      {events.length === 0 && <p>No event requests found</p>}
      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.eventName}</h3>
          <p>{event.eventDate} | {event.venue}</p>

          {event.status === "PENDING" && <button disabled>Waiting for Admin Approval</button>}
          {event.status === "REJECTED" && <span className="rejected">Rejected - {event.adminMessage}</span>}
          {event.status === "APPROVED_PAYMENT_PENDING" && 
            <button onClick={() => handlePayment(event.id)}>Proceed to Payment</button>}
          {event.status === "CONFIRMED" && <span className="confirmed">Payment Completed</span>}
        </div>
      ))}
    </div>
  );
};

export default MyEventRequests;
