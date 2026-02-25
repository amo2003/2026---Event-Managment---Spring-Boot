import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css";
import defaultImg from "../../assets/m4.jpg";

const EventDetail = ({ owner }) => { // owner passed from App.js or context
  const { id } = useParams(); // eventId
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/public/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const getEventImage = () => event?.imageUrl
    ? `http://localhost:8080/images/events/${event.imageUrl}`
    : defaultImg;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="event-detail">
        <button className="event-back" onClick={() => navigate(-1)}>←</button>
        <div className="event-detail-inner">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail">
        <button className="event-back" onClick={() => navigate(-1)}>←</button>
        <div className="event-detail-inner">
          <p>Event not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <button className="event-back" onClick={() => navigate(-1)}>←</button>

      <div className="event-detail-container">
        {/* Event Image */}
        <div className="event-hero-image">
          <img src={getEventImage()} alt={event.eventName} />
          <div className="event-hero-overlay">
            <h1>{event.eventName}</h1>
            <p className="event-society-name">Organized by: {event.societyName}</p>
          </div>
        </div>

        {/* Event Details */}
        <div className="event-info-section">
          <div className="event-info-card">
            <h2>📅 Event Details</h2>
            <div className="event-info-grid">
              <div className="info-item">
                <span className="info-label">Date</span>
                <span className="info-value">{formatDate(event.eventDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time</span>
                <span className="info-value">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Venue</span>
                <span className="info-value">{event.venue}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`info-value status-badgee ${event.status?.toLowerCase()}`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="event-description-card">
              <h2>📝 About This Event</h2>
              <p>{event.description}</p>
            </div>
          )}

          {/* Stall Owners Section */}
          <div className="stall-owners-section">
            <h2>🏪 Stall Opportunities</h2>
            <p className="stall-info">
              Interested in setting up a stall at this event? Connect with the organizers!
            </p>
            <div className="stall-buttons">
              <button
                className="stall-btn apply-btn"
                onClick={() => navigate("/slogin", { state: { eventId: event.id } })}
              >
                {owner ? "Apply for Stall" : "Login to Apply"}
              </button>
              <button
                className="stall-btn contact-btn"
                onClick={() => navigate(`/contact-society/${event.societyId}`)}
              >
                Contact Organizer
              </button>
            </div>
          </div>

          {/* Society Info */}
          <div className="society-info-section">
            <h2>🎓 About the Organizer</h2>
            <div className="society-card" onClick={() => navigate(`/society/${event.societyId}`)}>
              <span className="society-name">{event.societyName}</span>
              <span className="view-profile">View Profile →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;