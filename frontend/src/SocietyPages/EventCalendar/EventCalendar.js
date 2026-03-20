// src/pages/EventCalendar.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventCalendar.css";
import { useNavigate } from "react-router-dom";

const EventCalendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/calendar/all") 
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

  // Helper: Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Helper: Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper: Check if day has event
  const hasEvent = (day) => {
    return calendar.some(
      (e) =>
        new Date(e.eventDate).getDate() === day &&
        new Date(e.eventDate).getMonth() === currentMonth.getMonth() &&
        new Date(e.eventDate).getFullYear() === currentMonth.getFullYear()
    );
  };

  // Navigate month
  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={"empty-" + i} className="empty-day"></div>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(
      <div
        key={d}
        className={`calendar-day ${hasEvent(d) ? "event-day" : ""}`}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="calendar-page">
       <button className="cal-back-btn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="calendar-container">
        <h2 className="calendar-title">Event Calendar</h2>
        <div className="month-nav">
          <button onClick={prevMonth}>◀</button>
          <span>{monthName} {year}</span>
          <button onClick={nextMonth}>▶</button>
        </div>

        <div className="calendar-grid">
          <div className="week-day">Sun</div>
          <div className="week-day">Mon</div>
          <div className="week-day">Tue</div>
          <div className="week-day">Wed</div>
          <div className="week-day">Thu</div>
          <div className="week-day">Fri</div>
          <div className="week-day">Sat</div>
          {calendarDays}
        </div>

        <div className="event-list">
          <h3>Events This Month</h3>
          {calendar
            .filter(
              (e) =>
                new Date(e.eventDate).getMonth() === currentMonth.getMonth() &&
                new Date(e.eventDate).getFullYear() === currentMonth.getFullYear()
            )
            .map((e) => (
              <div key={e.id} className="event-card">
                <h4>{e.eventName}</h4>
                <p>
                  {new Date(e.eventDate).toLocaleDateString("en-GB")} | {e.startTime} - {e.endTime}
                </p>
                <p>Venue: {e.venue}</p>
              </div>
            ))}
          {calendar.filter(
            (e) =>
              new Date(e.eventDate).getMonth() === currentMonth.getMonth() &&
              new Date(e.eventDate).getFullYear() === currentMonth.getFullYear()
          ).length === 0 && <p>No events this month</p>}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;