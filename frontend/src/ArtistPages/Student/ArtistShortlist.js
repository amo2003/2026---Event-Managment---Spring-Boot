import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import artistService from "../../services/artistService";
import voteService from "../../services/voteService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ArtistShortlist() {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [voteResults, setVoteResults] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArtists();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchVoteResults(selectedEventId);
    } else {
      setVoteResults([]);
    }
  }, [selectedEventId]);

  const fetchArtists = async () => {
    setLoadingArtists(true);
    try {
      const response = await artistService.getAllArtists();
      setArtists(response.data || []);
    } catch (err) {
      console.error("Failed to fetch artists:", err);
      setArtists([]);
      setError("Failed to load artists.");
    } finally {
      setLoadingArtists(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axios.get("http://localhost:8080/api/admin/events");
      setEvents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
      setError("Failed to load events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchVoteResults = async (eventId) => {
    setLoadingResults(true);
    setError("");
    try {
      const response = await voteService.getVoteResults(eventId);
      setVoteResults(response.data || []);
    } catch (err) {
      console.error("Failed to fetch vote results:", err);
      setVoteResults([]);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load vote results."
      );
    } finally {
      setLoadingResults(false);
    }
  };

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
  );

  const shortlist = useMemo(() => {
    if (!selectedEventId) return [];

    const merged = voteResults
      .map((result) => {
        const artist = artists.find(
          (a) => String(a.id) === String(result.artistId)
        );

        if (!artist) return null;

        return {
          ...artist,
          voteCount: result.voteCount || 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

    return merged;
  }, [voteResults, artists, selectedEventId]);

  const topArtist = shortlist.length > 0 ? shortlist[0] : null;

  return (
    <ArtistModuleLayout
      title="Artist Shortlist"
      subtitle="Browse artists available for your event and see who has the most votes."
    >
      <div style={{ marginBottom: 24 }}>
        <div className="artist-form-group">
          <label className="artist-form-label">Filter by Event</label>
          <select
            className="artist-form-select"
            style={{ maxWidth: 360 }}
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents}
          >
            <option value="">
              {loadingEvents ? "Loading events..." : "Select an event..."}
            </option>
            {events.map((event) => (
              <option key={event.id} value={String(event.id)}>
                {event.eventName} — {event.venue}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="artist-form-message error">{error}</p>}

      {loadingArtists || loadingEvents || loadingResults ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading...
        </div>
      ) : !selectedEventId ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          Please select an event.
        </div>
      ) : shortlist.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No artists found for this event.
        </div>
      ) : (
        <>
          {selectedEvent && (
            <div className="ah-card" style={{ marginBottom: 20 }}>
              <div className="ah-card-title">{selectedEvent.eventName}</div>
              <div className="ah-card-row">
                <span className="ah-card-label">Venue</span>
                <span className="ah-card-value">{selectedEvent.venue}</span>
              </div>
              {selectedEvent.eventDate && (
                <div className="ah-card-row">
                  <span className="ah-card-label">Date</span>
                  <span className="ah-card-value">{selectedEvent.eventDate}</span>
                </div>
              )}
            </div>
          )}

          {topArtist && (
            <div
              className="ah-card"
              style={{
                marginBottom: 20,
                border: "1px solid var(--ah-accent)",
                boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--ah-accent-light)",
                  marginBottom: 12,
                }}
              >
                Most Voted Artist
              </div>

              <div className="ah-artist-header">
                <div className="ah-artist-avatar">
                  {getInitials(topArtist.artistName)}
                </div>

                <div>
                  <div className="ah-artist-name">{topArtist.artistName}</div>
                  <div className="ah-artist-category">{topArtist.category}</div>
                </div>

                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--ah-accent)",
                    color: "#fff",
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontWeight: 600,
                  }}
                >
                  {topArtist.voteCount} Votes
                </span>
              </div>

              {topArtist.bio && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ah-text-3)",
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {topArtist.bio}
                </p>
              )}

              {topArtist.performancePreferences && (
                <p style={{ fontSize: 12, color: "var(--ah-text-2)" }}>
                  <span style={{ color: "var(--ah-text-3)" }}>
                    Preferences:{" "}
                  </span>
                  {topArtist.performancePreferences}
                </p>
              )}

              {topArtist.email && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                    {topArtist.email}
                  </span>
                </div>
              )}
            </div>
          )}

          {shortlist.map((artist, index) => (
            <div className="ah-card" key={artist.id}>
              <div className="ah-artist-header">
                <div className="ah-artist-avatar">
                  {getInitials(artist.artistName)}
                </div>

                <div>
                  <div className="ah-artist-name">
                    {artist.artistName}
                    {index === 0 && (
                      <span
                        style={{
                          marginLeft: 10,
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: "var(--ah-accent-dim)",
                          color: "var(--ah-accent-light)",
                          verticalAlign: "middle",
                        }}
                      >
                        TOP VOTED
                      </span>
                    )}
                  </div>
                  <div className="ah-artist-category">{artist.category}</div>
                </div>

                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--ah-accent-dim)",
                    color: "var(--ah-accent-light)",
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {artist.voteCount} Votes
                </span>
              </div>

              {artist.bio && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ah-text-3)",
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {artist.bio}
                </p>
              )}

              {artist.performancePreferences && (
                <p style={{ fontSize: 12, color: "var(--ah-text-2)" }}>
                  <span style={{ color: "var(--ah-text-3)" }}>
                    Preferences:{" "}
                  </span>
                  {artist.performancePreferences}
                </p>
              )}

              {artist.email && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                    {artist.email}
                  </span>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistShortlist;