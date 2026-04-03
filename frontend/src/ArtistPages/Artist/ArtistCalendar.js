import React, { useContext, useEffect, useState } from "react";
import calendarService from "../../services/calendarService";
import { AuthContext } from "../../context/AuthContext";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function ArtistCalendar() {
  const { user } = useContext(AuthContext);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const artistId = user?.userType === "artist" ? user.id : null;

  const fetchCalendar = async () => {
    if (!artistId) { setError("Artist login required."); setLoading(false); return; }
    setError("");
    try {
      const response = await calendarService.getCalendarByArtist(artistId);
      setCalendarEvents(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCalendar(); }, [artistId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ArtistModuleLayout title="My Calendar" subtitle="Confirmed events synced to your schedule.">
      {error && <div className="ah-error">{error}</div>}

      {loading ? (
        <div className="ah-state"><div className="ah-state-icon">◌</div>Loading calendar…</div>
      ) : calendarEvents.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">📅</div>
          No calendar events yet.
        </div>
      ) : (
        calendarEvents.map((event) => (
          <div className="ah-card" key={event.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div className="ah-card-title">{event.eventName}</div>
              <span className={`ah-badge ${event.syncStatus === "SYNCED" ? "ah-badge-synced" : "ah-badge-pending"}`}>
                {event.syncStatus}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
              <div className="ah-card-row">
                <span className="ah-card-label">Venue</span>
                <span className="ah-card-value">{event.venue}</span>
              </div>
              <div className="ah-card-row">
                <span className="ah-card-label">Date &amp; Time</span>
                <span className="ah-card-value">{event.eventDateTime}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistCalendar;