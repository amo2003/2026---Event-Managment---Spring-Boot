import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import artistService from "../../services/artistService";
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

function normalizeName(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function getErrorMessage(err) {
  if (!err) return "Failed to submit vote.";

  if (typeof err.response?.data === "string") {
    return err.response.data;
  }

  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.response?.data?.error) {
    return err.response.data.error;
  }

  if (err.message) {
    return err.message;
  }

  return "Failed to submit vote.";
}

function VoteArtist() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [selectedArtistName, setSelectedArtistName] = useState("");
  const [selectedArtistStatus, setSelectedArtistStatus] = useState("");
  const [studentId, setStudentId] = useState(
    localStorage.getItem("studentId") || ""
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsResponse, artistsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/events"),
        artistService.getAllArtists(),
      ]);

      const withArtists = (eventsResponse.data || []).filter(
        (e) => e.artists && e.artists.trim()
      );

      setEvents(withArtists);
      setAllArtists(artistsResponse.data || []);
    } catch (err) {
      console.error("Failed to load vote artist data:", err);
      setError("Failed to load events or artists.");
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find(
    (e) => String(e.id) === String(selectedEventId)
  );

  const artistNames = useMemo(() => {
    return selectedEvent?.artists
      ? selectedEvent.artists
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [];
  }, [selectedEvent]);

  const matchedArtists = useMemo(() => {
    return artistNames.map((name) => {
      const normalized = normalizeName(name);

      const registeredArtist = allArtists.find(
        (a) => normalizeName(a.artistName) === normalized
      );

      return {
        name,
        id: registeredArtist?.id || null,
        status: registeredArtist ? "REGISTERED" : "NOT_REGISTERED",
      };
    });
  }, [artistNames, allArtists]);

  const handleArtistSelect = (e) => {
    const name = e.target.value;
    setSelectedArtistName(name);

    const match = matchedArtists.find(
      (a) => normalizeName(a.name) === normalizeName(name)
    );

    setSelectedArtistId(match?.id || "");
    setSelectedArtistStatus(match?.status || "");
    setMessage("");
    setError("");
  };

  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    setStudentId(value);
    localStorage.setItem("studentId", value);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedEventId || !selectedArtistName) {
      setError("Please select both an event and an artist.");
      return;
    }

    if (!studentId.trim()) {
      setError("Please enter a Student ID.");
      return;
    }

    setSubmitting(true);

    try {
      const [eventsResponse, artistsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/events"),
        artistService.getAllArtists(),
      ]);

      const refreshedEvents = (eventsResponse.data || []).filter(
        (ev) => ev.artists && ev.artists.trim()
      );
      const refreshedArtists = artistsResponse.data || [];

      const refreshedSelectedEvent = refreshedEvents.find(
        (ev) => String(ev.id) === String(selectedEventId)
      );

      const refreshedArtistNames = refreshedSelectedEvent?.artists
        ? refreshedSelectedEvent.artists
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const refreshedMatchedArtists = refreshedArtistNames.map((name) => {
        const normalized = normalizeName(name);

        const registeredArtist = refreshedArtists.find(
          (a) => normalizeName(a.artistName) === normalized
        );

        return {
          name,
          id: registeredArtist?.id || null,
          status: registeredArtist ? "REGISTERED" : "NOT_REGISTERED",
        };
      });

      const refreshedMatch = refreshedMatchedArtists.find(
        (a) => normalizeName(a.name) === normalizeName(selectedArtistName)
      );

      const finalArtistId = refreshedMatch?.id || selectedArtistId;
      const finalStatus = refreshedMatch?.status || selectedArtistStatus;

      if (!finalArtistId) {
        if (finalStatus === "NOT_REGISTERED") {
          setError(
            `Artist "${selectedArtistName}" is not registered in the system yet. Please ask the organizer to register the artist before voting.`
          );
        } else {
          setError("Selected artist could not be found.");
        }
        return;
      }

      const payload = {
        artistId: Number(finalArtistId),
        eventId: Number(selectedEventId),
        studentId: studentId.trim(),
      };

      const response = await axios.post(
        "http://localhost:8080/api/artist-votes",
        payload
      );

      const successMessage =
        typeof response.data === "string"
          ? response.data
          : response.data?.message || "Vote submitted successfully.";

      setMessage(successMessage);
      setSelectedEventId("");
      setSelectedArtistName("");
      setSelectedArtistId("");
      setSelectedArtistStatus("");

      setTimeout(() => navigate("/student/vote-confirmation"), 800);
    } catch (err) {
      console.error("Vote submit error:", err);
      setError(getErrorMessage(err));
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
              <label className="artist-form-label">Student ID</label>
              <input
                className="artist-form-input"
                type="text"
                placeholder="Enter student ID"
                value={studentId}
                onChange={handleStudentIdChange}
                required
              />
            </div>

            <div className="artist-form-group">
              <label className="artist-form-label">Event</label>
              <select
                className="artist-form-select"
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  setSelectedArtistName("");
                  setSelectedArtistId("");
                  setSelectedArtistStatus("");
                  setMessage("");
                  setError("");
                }}
                required
              >
                <option value="">
                  {loading ? "Loading events..." : "Select an event…"}
                </option>
                {events.map((event) => (
                  <option key={event.id} value={String(event.id)}>
                    {event.eventName} — {event.venue}
                  </option>
                ))}
              </select>
            </div>

            {selectedEventId && matchedArtists.length > 0 && (
              <div className="artist-form-group">
                <label className="artist-form-label">Artist</label>
                <select
                  className="artist-form-select"
                  value={selectedArtistName}
                  onChange={handleArtistSelect}
                  required
                >
                  <option value="">Select an artist…</option>
                  {matchedArtists.map((a, i) => (
                    <option key={i} value={a.name}>
                      {a.name}
                      {a.status === "REGISTERED"
                        ? " (registered)"
                        : " (not registered)"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedEventId && matchedArtists.length === 0 && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ah-text-3)",
                  marginBottom: 16,
                }}
              >
                No artists listed for this event yet.
              </p>
            )}

            <button
              type="submit"
              className="artist-form-button"
              disabled={submitting || !selectedArtistName || !studentId.trim()}
            >
              {submitting ? "Submitting…" : "Submit Vote"}
            </button>
          </form>

          {message && <p className="artist-form-message success">{message}</p>}
          {error && <p className="artist-form-message error">{error}</p>}
        </div>

        <div>
          {selectedEvent && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>
                Your Selection
              </div>

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
                <div className="ah-card-row">
                  <span className="ah-card-label">Date</span>
                  <span className="ah-card-value">{selectedEvent.eventDate}</span>
                </div>
              </div>

              {selectedArtistName && (
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
                        fontWeight: 700,
                        color: "var(--ah-accent-light)",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(selectedArtistName)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--ah-text-1)",
                        }}
                      >
                        {selectedArtistName}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color:
                            selectedArtistStatus === "REGISTERED"
                              ? "var(--ah-text-3)"
                              : "#ef4444",
                        }}
                      >
                        {selectedArtistStatus === "REGISTERED"
                          ? "Registered ✓"
                          : "Not registered"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedArtistName && selectedArtistStatus === "REGISTERED" && (
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
                  Student <strong>{studentId || "N/A"}</strong> is voting for{" "}
                  <strong>{selectedArtistName}</strong> to perform at{" "}
                  <strong>{selectedEvent.eventName}</strong>. This cannot be undone.
                </div>
              )}

              {selectedArtistName && selectedArtistStatus === "NOT_REGISTERED" && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    borderRadius: "var(--ah-radius-md)",
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "#f87171",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>{selectedArtistName}</strong> is not registered in the
                  system yet. Please register the artist before students can vote.
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