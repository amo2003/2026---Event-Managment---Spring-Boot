import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import voteService from "../../services/voteService";
import artistService from "../../services/artistService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function normalizeName(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function VoteResults() {
  const [events, setEvents] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setError("");
    setLoadingEvents(true);

    try {
      const [eventsResponse, artistsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/events"),
        artistService.getAllArtists(),
      ]);

      setEvents(eventsResponse.data || []);
      setAllArtists(artistsResponse.data || []);
    } catch (err) {
      console.error("Error fetching initial vote result data:", err);
      setError("Failed to load events or artists.");
      setEvents([]);
      setAllArtists([]);
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
      setError(err.response?.data?.message || "Failed to fetch vote results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
  );

  const eventArtistNames = useMemo(() => {
    return selectedEvent?.artists
      ? selectedEvent.artists
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      : [];
  }, [selectedEvent]);

  const eventArtistMap = useMemo(() => {
    const map = new Map();

    eventArtistNames.forEach((name) => {
      const matchedArtist = allArtists.find(
        (artist) => normalizeName(artist.artistName) === normalizeName(name)
      );

      if (matchedArtist?.id != null) {
        map.set(String(matchedArtist.id), {
          id: matchedArtist.id,
          artistName: matchedArtist.artistName,
          category: matchedArtist.category || "Unknown",
          email: matchedArtist.email || "",
          phoneNumber: matchedArtist.phoneNumber || "",
          status: "REGISTERED",
        });
      }
    });

    return map;
  }, [eventArtistNames, allArtists]);

  const sortedResults = useMemo(() => {
    const enriched = results.map((result) => {
      const matched = eventArtistMap.get(String(result.artistId));

      return {
        ...result,
        artistName: matched?.artistName || `Artist ID ${result.artistId}`,
        category: matched?.category || "Unknown",
        email: matched?.email || "",
        phoneNumber: matched?.phoneNumber || "",
      };
    });

    return enriched.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  }, [results, eventArtistMap]);

  const maxVotes =
    sortedResults.length > 0
      ? Math.max(...sortedResults.map((r) => r.voteCount || 0))
      : 1;

  const totalVotes = useMemo(() => {
    return sortedResults.reduce((sum, item) => sum + (item.voteCount || 0), 0);
  }, [sortedResults]);

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
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setResults([]);
              setError("");
            }}
            disabled={loadingEvents}
          >
            <option value="">
              {loadingEvents
                ? "Loading events..."
                : events.length === 0
                ? "No events available"
                : "Select an event..."}
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
          disabled={loading || loadingEvents || !selectedEventId}
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

          <div className="ah-card-row">
            <span className="ah-card-label">Artists Listed</span>
            <span className="ah-card-value">{eventArtistNames.length}</span>
          </div>

          <div className="ah-card-row">
            <span className="ah-card-label">Total Votes</span>
            <span className="ah-card-value">{totalVotes}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading...
        </div>
      ) : selectedEventId && sortedResults.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No vote results found.
        </div>
      ) : sortedResults.length > 0 ? (
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
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "var(--ah-text-1)",
                          fontWeight: 600,
                        }}
                      >
                        {result.artistName}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--ah-text-3)",
                        }}
                      >
                        {result.category} • ID: {result.artistId}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--ah-accent-light)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {result.voteCount} votes
                    </span>
                  </div>

                  <div className="ah-vote-bar-wrap">
                    <div
                      className="ah-vote-bar"
                      style={{
                        width: `${
                          maxVotes > 0
                            ? ((result.voteCount || 0) / maxVotes) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  {totalVotes > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: "var(--ah-text-3)",
                      }}
                    >
                      Share of votes:{" "}
                      {(((result.voteCount || 0) / totalVotes) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </ArtistModuleLayout>
  );
}

export default VoteResults;