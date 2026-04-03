/* ---- ArtistShortlist.js ---- */
import React, { useEffect, useMemo, useState } from "react";
import artistService from "../../services/artistService";
import eventService from "../../services/eventService";
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

function getVoteCount(artist) {
  return (
    artist.voteCount ??
    artist.votes ??
    artist.totalVotes ??
    artist.artistVotes ??
    0
  );
}

export function ArtistShortlist() {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
    fetchEvents();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await artistService.getAllArtists();
      setArtists(response.data || []);
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const filteredArtists = useMemo(() => {
    let result = [...artists];

    if (selectedEventId) {
      result = result.filter(
        (artist) =>
          String(artist.eventId) === String(selectedEventId) ||
          String(artist.id) === String(selectedEventId)
      );
    }

    result.sort((a, b) => getVoteCount(b) - getVoteCount(a));
    return result;
  }, [artists, selectedEventId]);

  const topArtist = filteredArtists.length > 0 ? filteredArtists[0] : null;

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
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName} — {event.venue}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading artists…
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No artists found.
        </div>
      ) : (
        <>
          {topArtist && (
            <div
              className="ah-card"
              style={{
                marginBottom: 20,
                border: "1px solid var(--ah-accent)",
                boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.2)"
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--ah-accent-light)",
                  marginBottom: 12
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
                    fontWeight: 600
                  }}
                >
                  {getVoteCount(topArtist)} Votes
                </span>
              </div>

              {topArtist.bio && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ah-text-3)",
                    marginBottom: 6,
                    lineHeight: 1.5
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
                  <span
                    style={{ fontSize: 12, color: "var(--ah-text-3)" }}
                  >
                    {topArtist.email}
                  </span>
                </div>
              )}
            </div>
          )}

          {filteredArtists.map((artist, index) => (
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
                          verticalAlign: "middle"
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
                    fontWeight: 500
                  }}
                >
                  {getVoteCount(artist)} Votes
                </span>
              </div>

              {artist.bio && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ah-text-3)",
                    marginBottom: 6,
                    lineHeight: 1.5
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

              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                {artist.email && (
                  <span style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                    {artist.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistShortlist;