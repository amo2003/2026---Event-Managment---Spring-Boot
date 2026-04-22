import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import invitationService from "../../services/invitationService";
import artistLeadService from "../../services/artistLeadService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function statusBadge(status) {
  const s = status?.toLowerCase();
  return <span className={`ah-badge ah-badge-${s}`}>{status}</span>;
}

function formatDateTime(dateTime) {
  if (!dateTime) return "N/A";

  try {
    return new Date(dateTime).toLocaleString();
  } catch {
    return dateTime;
  }
}

function getErrorMessage(err, fallback) {
  if (!err) return fallback;

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

  return fallback;
}

function FinalizeArtist() {
  const [events, setEvents] = useState([]);
  const [artistLeads, setArtistLeads] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventInvitations, setEventInvitations] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingEvents(true);
    setLoadingLeads(true);
    setError("");
    setInfo("");

    try {
      const [eventsResponse, leadsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/events"),
        artistLeadService.getAllLeads(),
      ]);

      setEvents(eventsResponse.data || []);
      setArtistLeads(leadsResponse.data || []);
    } catch (err) {
      console.error("Error loading finalize artist data:", err);
      setError("Failed to load events or artist leads.");
      setEvents([]);
      setArtistLeads([]);
    } finally {
      setLoadingEvents(false);
      setLoadingLeads(false);
    }
  };

  const loadInvitationsForEvent = async (eventId) => {
    if (!eventId) {
      setEventInvitations([]);
      return;
    }

    setLoadingInvitations(true);
    setError("");
    setInfo("");

    try {
      const response = await invitationService.getInvitationsByEvent(eventId);

      const finalized = (response.data || []).filter(
        (invitation) => invitation.status === "FINALIZED"
      );

      setEventInvitations(finalized);

      if (finalized.length === 0) {
        setInfo("No finalized artists found for this event.");
      }
    } catch (err) {
      console.error("Error fetching finalized invitations by event:", err);
      setError("Failed to load finalized artists for this event.");
      setEventInvitations([]);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleEventChange = async (e) => {
    const value = e.target.value;
    setSelectedEventId(value);
    setEventInvitations([]);
    setError("");
    setInfo("");

    if (!value) {
      return;
    }

    await loadInvitationsForEvent(value);
  };

  const handleReconsider = async (artist) => {
    const artistName = artist.artistName || artist.lead?.artistName || "this artist";

    const confirmed = window.confirm(
      `Move ${artistName} out of FINALIZED and back for reconsideration?`
    );

    if (!confirmed) return;

    setProcessingId(artist.id);
    setError("");
    setInfo("");

    try {
      await invitationService.reconsiderInvitation(artist.id);

      setInfo(`${artistName} has been moved back for reconsideration.`);
      await loadInvitationsForEvent(selectedEventId);
    } catch (err) {
      console.error("Failed to reconsider artist:", err);
      setError(
        getErrorMessage(err, "Failed to move the artist back for reconsideration.")
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (artist) => {
    const artistName = artist.artistName || artist.lead?.artistName || "this artist";

    const confirmed = window.confirm(
      `Remove ${artistName} from the finalized list?`
    );

    if (!confirmed) return;

    setProcessingId(artist.id);
    setError("");
    setInfo("");

    try {
      await invitationService.removeInvitation(artist.id);

      setInfo(`${artistName} has been removed from the finalized list.`);
      await loadInvitationsForEvent(selectedEventId);
    } catch (err) {
      console.error("Failed to remove artist:", err);
      setError(
        getErrorMessage(err, "Failed to remove the artist from the finalized list.")
      );
    } finally {
      setProcessingId(null);
    }
  };

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
  );

  const finalizedArtists = useMemo(() => {
    return eventInvitations.map((invitation) => {
      const matchedLead = artistLeads.find(
        (lead) => String(lead.id) === String(invitation.artistLeadId)
      );

      return {
        ...invitation,
        lead: matchedLead || null,
      };
    });
  }, [eventInvitations, artistLeads]);

  return (
    <ArtistModuleLayout
      title="Finalized Artists"
      subtitle="View, reconsider, or remove finalized artists for each event."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div className="artist-form-card">
          <h2 className="artist-form-title">Manage Finalized Artists</h2>

          <p
            style={{
              fontSize: 13,
              color: "var(--ah-text-2)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Select an event to view artists whose invitations were finalized for
            that event. Admin can move an artist back for reconsideration or
            remove them if they are not a good fit.
          </p>

          <div className="artist-form-group">
            <label className="artist-form-label">Event</label>
            <select
              className="artist-form-select"
              value={selectedEventId}
              onChange={handleEventChange}
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

          {error && <p className="artist-form-message error">{error}</p>}
          {info && <p className="artist-form-message success">{info}</p>}

          {loadingInvitations ? (
            <div className="ah-state" style={{ marginTop: 20 }}>
              <div className="ah-state-icon">◌</div>
              Loading...
            </div>
          ) : finalizedArtists.length > 0 ? (
            <div style={{ marginTop: 20 }}>
              {finalizedArtists.map((artist) => {
                const displayName =
                  artist.artistName || artist.lead?.artistName || "Artist";
                const isBusy = processingId === artist.id;

                return (
                  <div
                    className="ah-card"
                    key={artist.id}
                    style={{ marginBottom: 14 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                        gap: 12,
                      }}
                    >
                      <div>
                        <div className="ah-card-title">{displayName}</div>
                        <div style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                          {artist.eventName}
                        </div>
                      </div>
                      {statusBadge(artist.status)}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px 20px",
                        marginBottom: 8,
                      }}
                    >
                      <div className="ah-card-row">
                        <span className="ah-card-label">Venue</span>
                        <span className="ah-card-value">{artist.venue}</span>
                      </div>

                      <div className="ah-card-row">
                        <span className="ah-card-label">Date</span>
                        <span className="ah-card-value">
                          {formatDateTime(artist.eventDateTime)}
                        </span>
                      </div>

                      <div className="ah-card-row">
                        <span className="ah-card-label">Category</span>
                        <span className="ah-card-value">
                          {artist.lead?.category || "N/A"}
                        </span>
                      </div>

                      <div className="ah-card-row">
                        <span className="ah-card-label">Lead ID</span>
                        <span className="ah-card-value">
                          {artist.artistLeadId || "N/A"}
                        </span>
                      </div>
                    </div>

                    {artist.lead?.email && (
                      <div className="ah-card-row">
                        <span className="ah-card-label">Email</span>
                        <span className="ah-card-value">{artist.lead.email}</span>
                      </div>
                    )}

                    {artist.lead?.phoneNumber && (
                      <div className="ah-card-row">
                        <span className="ah-card-label">Phone</span>
                        <span className="ah-card-value">
                          {artist.lead.phoneNumber}
                        </span>
                      </div>
                    )}

                    {artist.organizerMessage && (
                      <div style={{ marginTop: 10 }}>
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
                          Organizer Message
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--ah-text-2)",
                            lineHeight: 1.5,
                          }}
                        >
                          {artist.organizerMessage}
                        </div>
                      </div>
                    )}

                    {artist.lead?.notes && (
                      <div style={{ marginTop: 10 }}>
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
                          Lead Notes
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--ah-text-2)",
                            lineHeight: 1.5,
                          }}
                        >
                          {artist.lead.notes}
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginTop: 16,
                      }}
                    >
                      <button
                        type="button"
                        className="artist-form-button"
                        style={{
                          width: "auto",
                          padding: "10px 16px",
                          background: "rgba(59,130,246,0.14)",
                          border: "1px solid rgba(59,130,246,0.28)",
                          color: "#93c5fd",
                        }}
                        onClick={() => handleReconsider(artist)}
                        disabled={isBusy}
                      >
                        {isBusy ? "Processing..." : "Reconsider"}
                      </button>

                      <button
                        type="button"
                        className="artist-form-button"
                        style={{
                          width: "auto",
                          padding: "10px 16px",
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.28)",
                          color: "#fca5a5",
                        }}
                        onClick={() => handleRemove(artist)}
                        disabled={isBusy}
                      >
                        {isBusy ? "Processing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : selectedEventId ? (
            <div className="ah-state" style={{ marginTop: 20 }}>
              <div className="ah-state-icon">⊘</div>
              No finalized artists found for this event.
            </div>
          ) : null}
        </div>

        <div>
          {selectedEvent && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>
                Event Summary
              </div>

              <div className="ah-card">
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--ah-text-3)",
                    marginBottom: 8,
                  }}
                >
                  Selected Event
                </div>

                <div className="ah-card-title">{selectedEvent.eventName}</div>

                <div className="ah-card-row" style={{ marginTop: 8 }}>
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
                  <span className="ah-card-label">Finalized Artists</span>
                  <span className="ah-card-value">{finalizedArtists.length}</span>
                </div>
              </div>

              {finalizedArtists.length > 0 && (
                <div className="ah-card" style={{ marginTop: 14 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "var(--ah-text-3)",
                      marginBottom: 8,
                    }}
                  >
                    Finalized Artist Names
                  </div>

                  {finalizedArtists.map((artist) => (
                    <div
                      key={`summary-${artist.id}`}
                      className="ah-card-row"
                      style={{ marginBottom: 6 }}
                    >
                      <span className="ah-card-value">
                        {artist.artistName || artist.lead?.artistName || "Artist"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default FinalizeArtist;