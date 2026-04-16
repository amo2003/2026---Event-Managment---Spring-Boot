import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import artistService from "../../services/artistService";
import voteService from "../../services/voteService";
import "./FinalArtist.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRankedArtists(artists = []) {
  let previousVoteCount = null;
  let currentRank = 0;

  return artists.map((artist, index) => {
    if (artist.voteCount !== previousVoteCount) {
      currentRank = index + 1;
      previousVoteCount = artist.voteCount;
    }

    return {
      ...artist,
      rank: currentRank,
    };
  });
}

function FinalArtist() {
  const navigate = useNavigate();

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
    setError("");
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
    setError("");
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
          id: artist.id,
          artistName: artist.artistName,
          category: artist.category,
          voteCount: Number(result.voteCount || 0),
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b.voteCount !== a.voteCount) {
          return b.voteCount - a.voteCount;
        }
        return (a.artistName || "").localeCompare(b.artistName || "");
      });

    return getRankedArtists(merged);
  }, [voteResults, artists, selectedEventId]);

  const topVoteCount =
    shortlist.length > 0 ? Math.max(...shortlist.map((a) => a.voteCount || 0)) : 0;

  const tiedTopArtists = shortlist.filter(
    (artist) => (artist.voteCount || 0) === topVoteCount
  );

  const isTie = tiedTopArtists.length > 1;
  const hasSingleLeader = tiedTopArtists.length === 1;
  const isLoading = loadingArtists || loadingEvents || loadingResults;

  return (
    <div className="final-artist-page">
      <section className="final-artist-hero">
        <div className="final-artist-hero-top">
          <button
            className="final-artist-back-btn"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back to Home
          </button>
        </div>

        <div className="final-artist-hero-content">
          <span className="final-artist-badge">STUDENT RESULTS</span>
          <h1>Artist Rankings & Final Shortlist</h1>
          <p>
            Explore the live student rankings for each event and see which
            artists are leading the vote.
          </p>
        </div>
      </section>

      <section className="final-artist-content">
        <div className="final-artist-filter-card">
          <div className="final-artist-filter-head">
            <div>
              <p className="final-artist-mini-label">FILTER RESULTS</p>
              <h3>Select an Event</h3>
            </div>
          </div>

          <label className="final-artist-label">Event</label>
          <select
            className="final-artist-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents}
          >
            <option value="">
              {loadingEvents ? "Loading events..." : "Choose an event"}
            </option>
            {events.map((event) => (
              <option key={event.id} value={String(event.id)}>
                {event.eventName} — {event.venue}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="final-artist-message error">{error}</div>}

        {isLoading ? (
          <div className="final-artist-state-card">
            <div className="final-artist-state-icon">◌</div>
            <h3>Loading results...</h3>
            <p>Please wait while the shortlist is being prepared.</p>
          </div>
        ) : !selectedEventId ? (
          <div className="final-artist-state-card">
            <div className="final-artist-state-icon">⊘</div>
            <h3>Select an event first</h3>
            <p>Choose an event above to see artist rankings and vote standings.</p>
          </div>
        ) : shortlist.length === 0 ? (
          <div className="final-artist-state-card">
            <div className="final-artist-state-icon">⊘</div>
            <h3>No results available</h3>
            <p>No artist votes have been recorded for this event yet.</p>
          </div>
        ) : (
          <>
            {selectedEvent && (
              <div className="final-artist-event-card">
                <div className="final-artist-event-top">
                  <div>
                    <p className="final-artist-mini-label">EVENT DETAILS</p>
                    <h2>{selectedEvent.eventName}</h2>
                  </div>
                  <span className="final-artist-event-pill">
                    {shortlist.length} Ranked
                  </span>
                </div>

                <div className="final-artist-event-grid">
                  <div className="final-artist-event-row">
                    <span>Venue</span>
                    <strong>{selectedEvent.venue || "N/A"}</strong>
                  </div>
                  <div className="final-artist-event-row">
                    <span>Date</span>
                    <strong>{selectedEvent.eventDate || "TBA"}</strong>
                  </div>
                </div>
              </div>
            )}

            {isTie ? (
              <div className="final-artist-top-card">
                <div className="final-artist-top-label">Tie for First Place</div>
                <h3 className="final-artist-top-title">
                  Multiple artists are leading this event
                </h3>
                <p className="final-artist-tie-text">
                  These artists are tied with <strong>{topVoteCount}</strong> votes
                  each.
                </p>

                <div className="final-artist-tie-grid">
                  {tiedTopArtists.map((artist) => (
                    <div className="final-artist-tie-item" key={artist.id}>
                      <div className="final-artist-rank-bubble">#{artist.rank}</div>

                      <div className="final-artist-avatar large">
                        {getInitials(artist.artistName)}
                      </div>

                      <div className="final-artist-tie-meta">
                        <h3>{artist.artistName}</h3>
                        <p>{artist.category || "Artist"}</p>
                      </div>

                      <div className="final-artist-vote-pill highlight">
                        {artist.voteCount} Votes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : hasSingleLeader ? (
              <div className="final-artist-top-card">
                <div className="final-artist-top-label">Current Leader</div>
                <h3 className="final-artist-top-title">
                  Top voted artist for this event
                </h3>

                <div className="final-artist-top-header">
                  <div className="final-artist-rank-bubble">#1</div>

                  <div className="final-artist-avatar large">
                    {getInitials(tiedTopArtists[0].artistName)}
                  </div>

                  <div className="final-artist-top-meta">
                    <h3>{tiedTopArtists[0].artistName}</h3>
                    <p>{tiedTopArtists[0].category || "Artist"}</p>
                  </div>

                  <div className="final-artist-vote-pill highlight">
                    {tiedTopArtists[0].voteCount} Votes
                  </div>
                </div>
              </div>
            ) : null}

            <div className="final-artist-results-head">
              <div>
                <p className="final-artist-mini-label">FULL RANKING</p>
                <h2>All Ranked Artists</h2>
              </div>
            </div>

            <div className="final-artist-list">
              {shortlist.map((artist) => {
                const isTopRank = artist.voteCount === topVoteCount;

                return (
                  <div className="final-artist-card" key={artist.id}>
                    <div className="final-artist-card-header">
                      <div className="final-artist-card-left">
                        <div className="final-artist-rank-bubble">
                          #{artist.rank}
                        </div>

                        <div className="final-artist-avatar">
                          {getInitials(artist.artistName)}
                        </div>

                        <div>
                          <div className="final-artist-name-row">
                            <h3>{artist.artistName}</h3>

                            {isTopRank && isTie && (
                              <span className="final-artist-top-badge">
                                TIED TOP
                              </span>
                            )}

                            {isTopRank && !isTie && (
                              <span className="final-artist-top-badge">
                                TOP VOTED
                              </span>
                            )}
                          </div>

                          <p className="final-artist-category">
                            {artist.category || "Artist"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`final-artist-vote-pill ${
                          isTopRank ? "highlight" : ""
                        }`}
                      >
                        {artist.voteCount} Votes
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default FinalArtist;