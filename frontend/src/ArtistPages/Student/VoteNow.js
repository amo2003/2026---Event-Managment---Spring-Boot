import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import artistService from "../../services/artistService";
import "./VoteNow.css";

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

function VoteNow() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [selectedArtistName, setSelectedArtistName] = useState("");
  const [selectedArtistStatus, setSelectedArtistStatus] = useState("");
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

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
    <div className="vote-now-page">
      <section className="vote-now-hero">
        <div className="vote-now-hero-inner">
          <span className="vote-now-badge">STUDENT VOTING</span>
          <h1>Vote for Your Favourite Artist</h1>
          <p>
            Help shape the lineup. Select an event, choose your favourite artist,
            and cast your vote.
          </p>

          <button
            className="vote-now-back-btn"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back to Home
          </button>
        </div>
      </section>

      <section className="vote-now-content">
        <div className="vote-now-grid">
          <div className="vote-now-card">
            <h2>Cast Your Vote</h2>
            <p className="vote-now-card-text">
              One vote per student per event. Make sure your Student ID is correct
              before submitting.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="vote-now-form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={handleStudentIdChange}
                  required
                />
              </div>

              <div className="vote-now-form-group">
                <label>Select Event</label>
                <select
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
                    {loading ? "Loading events..." : "Choose an event"}
                  </option>
                  {events.map((event) => (
                    <option key={event.id} value={String(event.id)}>
                      {event.eventName} — {event.venue}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEventId && matchedArtists.length > 0 && (
                <div className="vote-now-form-group">
                  <label>Select Artist</label>
                  <select
                    value={selectedArtistName}
                    onChange={handleArtistSelect}
                    required
                  >
                    <option value="">Choose an artist</option>
                    {matchedArtists.map((artist, index) => (
                      <option key={index} value={artist.name}>
                        {artist.name}
                        {artist.status === "REGISTERED"
                          ? ""
                          : " (not registered)"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedEventId && matchedArtists.length === 0 && (
                <p className="vote-now-muted">No artists listed for this event yet.</p>
              )}

              <button
                type="submit"
                className="vote-now-submit-btn"
                disabled={submitting || !selectedArtistName || !studentId.trim()}
              >
                {submitting ? "Submitting..." : "Submit Vote"}
              </button>
            </form>

            {message && <p className="vote-now-message success">{message}</p>}
            {error && <p className="vote-now-message error">{error}</p>}
          </div>

          <div className="vote-now-side">
            {selectedEvent ? (
              <>
                <div className="vote-now-info-card">
                  <span className="vote-now-info-label">EVENT</span>
                  <h3>{selectedEvent.eventName}</h3>
                  <div className="vote-now-info-row">
                    <span>Venue</span>
                    <span>{selectedEvent.venue}</span>
                  </div>
                  <div className="vote-now-info-row">
                    <span>Date</span>
                    <span>{selectedEvent.eventDate}</span>
                  </div>
                </div>

                {selectedArtistName && (
                  <div className="vote-now-info-card">
                    <div className="vote-now-artist-row">
                      <div className="vote-now-avatar">
                        {getInitials(selectedArtistName)}
                      </div>
                      <div>
                        <h4>{selectedArtistName}</h4>
                        <p
                          className={
                            selectedArtistStatus === "REGISTERED"
                              ? "status-ok"
                              : "status-bad"
                          }
                        >
                          {selectedArtistStatus === "REGISTERED"
                            ? "Registered ✓"
                            : "Not registered"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="vote-now-info-card">
                <h3>Before you vote</h3>
                <p className="vote-now-card-text">
                  Choose an event first to view the available artists for voting.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default VoteNow;