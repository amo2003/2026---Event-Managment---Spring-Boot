import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import artistService from "../../services/artistService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function VoteArtist() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [allArtists, setAllArtists] = useState([]); // from /api/artists
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState(""); // numeric ID
  const [selectedArtistName, setSelectedArtistName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch events with artists
    axios.get("http://localhost:8080/api/admin/events")
      .then(res => {
        const withArtists = (res.data || []).filter(e => e.artists && e.artists.trim());
        setEvents(withArtists);
      })
      .catch(() => setError("Failed to load events."));

    // Fetch all registered artists for ID lookup
    artistService.getAllArtists()
      .then(res => setAllArtists(res.data || []))
      .catch(() => {});
  }, []);

  const selectedEvent = events.find(e => String(e.id) === String(selectedEventId));

  // Parse artist names from the event's artists field
  const artistNames = selectedEvent?.artists
    ? selectedEvent.artists.split(",").map(a => a.trim()).filter(Boolean)
    : [];

  // Match each name to a registered artist to get their ID
  const matchedArtists = artistNames.map(name => {
    const found = allArtists.find(
      a => a.artistName?.toLowerCase().trim() === name.toLowerCase().trim()
    );
    return { name, id: found?.id || null };
  });

  const handleArtistSelect = (e) => {
    const name = e.target.value;
    setSelectedArtistName(name);
    const match = matchedArtists.find(a => a.name === name);
    setSelectedArtistId(match?.id || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    if (!selectedEventId || !selectedArtistName) {
      setError("Please select both an event and an artist.");
      return;
    }

    if (!selectedArtistId) {
      setError(`Artist "${selectedArtistName}" is not yet registered in the system. Please ask the organizer to register them first.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        artistId: Number(selectedArtistId),
        eventId: Number(selectedEventId),
        studentId: String(localStorage.getItem("studentId") || "anonymous"),
      };
      const response = await axios.post("http://localhost:8080/api/artist-votes", payload);
      setMessage(response.data || "Vote submitted successfully.");
      setSelectedEventId(""); setSelectedArtistName(""); setSelectedArtistId("");
      setTimeout(() => navigate("/student/vote-confirmation"), 800);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Failed to submit vote.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ArtistModuleLayout title="Vote for Artist" subtitle="Cast your vote for your preferred performer at this event.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        <div className="artist-form-card">
          <h2 className="artist-form-title">Cast Your Vote</h2>
          <p style={{ fontSize: 13, color: "var(--ah-text-2)", marginBottom: 20, lineHeight: 1.6 }}>
            Select the event and the artist you want to vote for. You can only vote once per event.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="artist-form-group">
              <label className="artist-form-label">Event</label>
              <select className="artist-form-select" value={selectedEventId}
                onChange={(e) => { setSelectedEventId(e.target.value); setSelectedArtistName(""); setSelectedArtistId(""); }} required>
                <option value="">Select an event…</option>
                {events.map(event => (
                  <option key={event.id} value={String(event.id)}>
                    {event.eventName} — {event.venue}
                  </option>
                ))}
              </select>
            </div>

            {selectedEventId && matchedArtists.length > 0 && (
              <div className="artist-form-group">
                <label className="artist-form-label">Artist</label>
                <select className="artist-form-select" value={selectedArtistName}
                  onChange={handleArtistSelect} required>
                  <option value="">Select an artist…</option>
                  {matchedArtists.map((a, i) => (
                    <option key={i} value={a.name}>
                      {a.name}{!a.id ? " (not yet registered)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedEventId && matchedArtists.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--ah-text-3)", marginBottom: 16 }}>
                No artists listed for this event yet.
              </p>
            )}

            <button type="submit" className="artist-form-button"
              disabled={submitting || !selectedArtistName}>
              {submitting ? "Submitting…" : "Submit Vote"}
            </button>
          </form>

          {message && <p className="artist-form-message success">{message}</p>}
          {error && <p className="artist-form-message error">{error}</p>}
        </div>

        <div>
          {selectedEvent && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>Your Selection</div>
              <div className="ah-card">
                <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ah-text-3)", marginBottom: 6 }}>Event</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ah-text-1)", marginBottom: 6 }}>{selectedEvent.eventName}</div>
                <div className="ah-card-row"><span className="ah-card-label">Venue</span><span className="ah-card-value">{selectedEvent.venue}</span></div>
                <div className="ah-card-row"><span className="ah-card-label">Date</span><span className="ah-card-value">{selectedEvent.eventDate}</span></div>
              </div>

              {selectedArtistName && (
                <div className="ah-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ah-accent-dim)", border: "1px solid rgba(139,92,246,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--ah-accent-light)", flexShrink: 0 }}>
                      {getInitials(selectedArtistName)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ah-text-1)" }}>{selectedArtistName}</div>
                      <div style={{ fontSize: 11, color: selectedArtistId ? "var(--ah-text-3)" : "#ef4444" }}>
                        {selectedArtistId ? "Registered ✓" : "Not yet registered"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedArtistName && selectedArtistId && (
                <div style={{ background: "var(--ah-accent-dim)", border: "1px solid rgba(139,92,246,.2)", borderRadius: "var(--ah-radius-md)", padding: "12px 14px", fontSize: 12, color: "var(--ah-accent-light)", lineHeight: 1.6 }}>
                  You are voting for <strong>{selectedArtistName}</strong> to perform at <strong>{selectedEvent.eventName}</strong>. This cannot be undone.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default VoteArtist;
