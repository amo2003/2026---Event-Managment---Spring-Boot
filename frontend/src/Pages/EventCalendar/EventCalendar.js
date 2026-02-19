// src/pages/EventCalendar.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const EventCalendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/calendar/all") // make sure backend is running
      .then((res) => {
        setCalendar(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load events");
        setLoading(false);
      });
  }, []);

  // Function to format date and time
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Approved Events Calendar</h2>

      {calendar.length === 0 && <p>No approved events yet.</p>}

      {calendar.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{item.eventName}</h3>
          <p>
            {formatDate(item.eventDate)} | {formatTime(item.startTime)} -{" "}
            {formatTime(item.endTime)}
          </p>
          <p>Venue: {item.venue}</p>
        </div>
      ))}
    </div>
  );
};

export default EventCalendar;
