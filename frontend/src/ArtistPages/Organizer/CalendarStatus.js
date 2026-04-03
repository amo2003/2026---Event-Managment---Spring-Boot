import React, { useEffect, useState } from "react";
import calendarService from "../../services/calendarService";
import ArtistModuleLayout from "../../ArtistPages/ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function CalendarStatus() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedEvents();
  }, []);

  const fetchPublishedEvents = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await calendarService.getAllPublishedEvents();
      setCalendarEvents(response.data || []);
    } catch (err) {
      setError("Failed to fetch published events");
      setCalendarEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ArtistModuleLayout
      title="Calendar Status"
      subtitle="View all published events."
    >
      {error && <div className="ah-error">{error}</div>}

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading…
        </div>
      ) : calendarEvents.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No published events found.
        </div>
      ) : (
        calendarEvents.map((event) => (
          <div className="ah-card" key={event.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10
              }}
            >
              <div className="ah-card-title">{event.eventName}</div>
              <span
                className={`ah-badge ${
                  event.syncStatus === "SYNCED"
                    ? "ah-badge-synced"
                    : "ah-badge-pending"
                }`}
              >
                {event.syncStatus || "PUBLISHED"}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px 20px"
              }}
            >
              <div className="ah-card-row">
                <span className="ah-card-label">Venue</span>
                <span className="ah-card-value">{event.venue}</span>
              </div>

              <div className="ah-card-row">
                <span className="ah-card-label">Date &amp; Time</span>
                <span className="ah-card-value">{event.eventDateTime}</span>
              </div>

              {event.organizerName && (
                <div className="ah-card-row">
                  <span className="ah-card-label">Organizer</span>
                  <span className="ah-card-value">{event.organizerName}</span>
                </div>
              )}

              {event.status && (
                <div className="ah-card-row">
                  <span className="ah-card-label">Status</span>
                  <span className="ah-card-value">{event.status}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </ArtistModuleLayout>
  );
}

export default CalendarStatus;