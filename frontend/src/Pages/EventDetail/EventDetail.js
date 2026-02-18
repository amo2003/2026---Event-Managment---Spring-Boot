import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EventDetail.css";

const EVENT_DATA = {
  1: {
    title: "Tech Summit",
    description: "A full-day summit featuring keynote speakers, workshops, and live demos from leading tech innovators on campus.",
  },
  2: {
    title: "Cultural Night",
    description: "An immersive evening of music, dance, and performances celebrating the diversity of university life.",
  },
  3: {
    title: "Sports Meet",
    description: "Inter-faculty athletics and games with live commentary, awards, and after-event highlights.",
  },
  4: {
    title: "Innovation Expo",
    description: "Showcase of student projects, startups, and cutting-edge research with interactive booths.",
  },
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = EVENT_DATA[id] || EVENT_DATA[1];

  return (
    <div className="event-detail">
      <button
        className="event-back"
        onClick={() => navigate(-1)}
        aria-label="Back to home"
      >
        ✕
      </button>

      <div className="event-detail-inner">
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p className="event-detail-note">
          This is a demo detail page. You can update this content to match your
          real event information.
        </p>
      </div>
    </div>
  );
};

export default EventDetail;
