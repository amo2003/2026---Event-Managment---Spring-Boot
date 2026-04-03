import React, { useEffect, useMemo, useState } from "react";
import voteService from "../../services/voteService";
import eventService from "../../services/eventService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function VoteResults() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setError("");
    setLoadingEvents(true);

    try {
      const response = await eventService.getAllEvents();
      setEvents(response.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchResults = async () => {
    setError("");
    setLoading(true);

    if (!selectedEventId) {
      setError("Please select an event.");
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      const response = await voteService.getVoteResults(selectedEventId);
      setResults(response.data || []);
    } catch (err) {
      console.error("Error fetching vote results:", err);
      setError("Failed to fetch vote results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => b.voteCount - a.voteCount);
  }, [results]);

  const maxVotes =
    sortedResults.length > 0
      ? Math.max(...sortedResults.map((r) => r.voteCount || 0))
      : 1;

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
  );

  return (
    <ArtistModuleLayout
      title="Vote Results"
      subtitle="See how students ranked artists for this event."
    >
      <div className="artist-form-card" style={{ marginBottom: 20 }}>
        <h2 className="artist-form-title">View Results</h2>

        <div className="artist-form-group">
          <label className="artist-form-label">Event</label>
          <select
            className="artist-form-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents}
          >
            <option value="">
              {loadingEvents ? "Loading events..." : "Select an event…"}
            </option>
            {events.map((event) => (
              <option key={event.id} value={String(event.id)}>
                {event.eventName} — {event.venue}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="artist-form-button"
          onClick={fetchResults}
          disabled={loading || loadingEvents}
        >
          {loading ? "Loading..." : "Get Results"}
        </button>

        {error && <p className="artist-form-message error">{error}</p>}
      </div>

      {selectedEvent && !loading && (
        <div className="ah-card" style={{ marginBottom: 16 }}>
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

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading…
        </div>
      ) : sortedResults.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No vote results found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sortedResults.map((result, index) => (
            <div
              className="ah-card"
              key={`${result.artistId}-${index}`}
              style={{ padding: "14px 18px" }}
            >
              <div className="ah-vote-rank">
                <div
                  className={`ah-vote-rank-num ${
                    index === 0
                      ? "rank-1"
                      : index === 1
                      ? "rank-2"
                      : index === 2
                      ? "rank-3"
                      : ""
                  }`}
                >
                  #{index + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--ah-text-1)",
                        fontWeight: 500,
                      }}
                    >
                      Artist ID: {result.artistId}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--ah-accent-light)",
                        fontWeight: 600,
                      }}
                    >
                      {result.voteCount} votes
                    </span>
                  </div>

                  <div className="ah-vote-bar-wrap">
                    <div
                      className="ah-vote-bar"
                      style={{
                        width: `${maxVotes > 0 ? (result.voteCount / maxVotes) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ArtistModuleLayout>
  );
}

export default VoteResults;