import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import voteService from "../../services/voteService";
import eventService from "../../services/eventService";
import artistService from "../../services/artistService";
import artistLeadService from "../../services/artistLeadService";
import { AuthContext } from "../../context/AuthContext";
import ArtistModuleLayout from "../../ArtistPages/ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function VoteArtist() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const studentId =
    user?.userType === "student"
      ? user.id
      : localStorage.getItem("studentId");

  useEffect(() => {
    Promise.all([
      eventService.getAllEvents(),
      artistService.getAllArtists(),
      artistLeadService.getAllLeads(),
    ])
      .then(([eventRes, artistRes, leadRes]) => {
        const eventData = eventRes.data || [];
        const artistData = artistRes.data || [];
        const leadData = leadRes.data || [];

        const formattedArtists = artistData.map((artist) => ({
          ...artist,
          sourceType: "ARTIST",
          uniqueId: `artist-${artist.id}`,
          realArtistId: artist.id,
        }));

        const formattedLeads = leadData.map((lead) => ({
          ...lead,
          sourceType: "LEAD",
          uniqueId: `lead-${lead.id}`,
          realArtistId: null,
        }));

        setEvents(eventData);
        setArtists([...formattedArtists, ...formattedLeads]);
      })
      .catch((err) => {
        console.error("Error loading vote form data:", err);
        setError("Failed to load artists or events.");
      });
  }, []);

  const selectedArtist = artists.find(
    (artist) => String(artist.uniqueId) === String(selectedArtistId)
  );

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!studentId) {
      setError("Student login required.");
      return;
    }

    if (!selectedArtist || !selectedEvent) {
      setError("Please select both an event and an artist.");
      return;
    }

    if (selectedArtist.sourceType === "LEAD") {
      setError(
        "This is an artist lead. Convert the lead into a real artist before voting."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        artistId: Number(selectedArtist.realArtistId),
        eventId: Number(selectedEventId),
        studentId: String(studentId),
      };

      const response = await voteService.submitVote(payload);
      setMessage(response.data || "Vote submitted successfully.");
      setSelectedEventId("");
      setSelectedArtistId("");
      setTimeout(() => navigate("/student/vote-confirmation"), 800);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to submit vote."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ArtistModuleLayout
      title="Vote for Artist"
      subtitle="Cast your vote for your preferred performer at this event."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div className="artist-form-card">
          <h2 className="artist-form-title">Cast Your Vote</h2>

          <p
            style={{
              fontSize: 13,
              color: "var(--ah-text-2)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Select the event and the artist you want to vote for. You can only
            vote once per event.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="artist-form-group">
              <label className="artist-form-label">Event</label>
              <select
                className="artist-form-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                required
              >
                <option value="">Select an event…</option>
                {events.map((event) => (
                  <option key={event.id} value={String(event.id)}>
                    {event.eventName} — {event.venue}
                  </option>
                ))}
              </select>
            </div>

            <div className="artist-form-group">
              <label className="artist-form-label">Artist / Artist Lead</label>
              <select
                className="artist-form-select"
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                required
              >
                <option value="">Select an artist…</option>
                {artists.map((artist) => (
                  <option key={artist.uniqueId} value={artist.uniqueId}>
                    {artist.artistName} — {artist.category}
                    {artist.sourceType === "LEAD" ? " (Lead)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="artist-form-button"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Vote"}
            </button>
          </form>

          {message && <p className="artist-form-message success">{message}</p>}
          {error && <p className="artist-form-message error">{error}</p>}
        </div>

        <div>
          {(selectedArtist || selectedEvent) && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>
                Your Selection
              </div>

              {selectedArtist && (
                <div className="ah-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--ah-accent-dim)",
                        border: "1px solid rgba(139,92,246,.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--ah-accent-light)",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(selectedArtist.artistName)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--ah-text-1)",
                        }}
                      >
                        {selectedArtist.artistName}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "var(--ah-text-3)" }}
                      >
                        {selectedArtist.category}
                        {selectedArtist.sourceType === "LEAD" ? " • Lead" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedEvent && (
                <div className="ah-card">
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "var(--ah-text-3)",
                      marginBottom: 6,
                    }}
                  >
                    Event
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ah-text-1)",
                      marginBottom: 6,
                    }}
                  >
                    {selectedEvent.eventName}
                  </div>
                  <div className="ah-card-row">
                    <span className="ah-card-label">Venue</span>
                    <span className="ah-card-value">{selectedEvent.venue}</span>
                  </div>
                </div>
              )}

              {selectedArtist && selectedEvent && (
                <div
                  style={{
                    background: "var(--ah-accent-dim)",
                    border: "1px solid rgba(139,92,246,.2)",
                    borderRadius: "var(--ah-radius-md)",
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "var(--ah-accent-light)",
                    lineHeight: 1.6,
                  }}
                >
                  You are voting for <strong>{selectedArtist.artistName}</strong>{" "}
                  to perform at <strong>{selectedEvent.eventName}</strong>.
                  {selectedArtist.sourceType === "LEAD"
                    ? " This is currently a lead, so it must be converted into a real artist before voting."
                    : " This cannot be undone."}
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