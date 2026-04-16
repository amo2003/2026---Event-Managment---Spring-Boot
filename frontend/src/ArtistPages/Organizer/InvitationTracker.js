import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import invitationService from "../../services/invitationService";
import calendarService from "../../services/calendarService";
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

function normalize(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function InvitationTracker() {
  const [events, setEvents] = useState([]);
  const [artistLeads, setArtistLeads] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchInvitationsByEvent(selectedEventId);
    } else {
      setInvitations([]);
      setInfo("");
      setError("");
      setMessage("");
    }
  }, [selectedEventId]);

  const fetchInitialData = async () => {
    setLoadingEvents(true);
    setLoadingLeads(true);
    setError("");
    setMessage("");
    setInfo("");

    try {
      const [eventsResponse, leadsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/events"),
        artistLeadService.getAllLeads(),
      ]);

      const eventData = (eventsResponse.data || []).filter(
        (event) => event.artists && event.artists.trim()
      );

      setEvents(eventData);
      setArtistLeads(leadsResponse.data || []);
    } catch (err) {
      console.error("Error loading invitation tracker data:", err);
      setError("Failed to load events or artist leads.");
      setEvents([]);
      setArtistLeads([]);
    } finally {
      setLoadingEvents(false);
      setLoadingLeads(false);
    }
  };

  const fetchInvitationsByEvent = async (eventId) => {
    setLoadingInvitations(true);
    setError("");
    setMessage("");
    setInfo("");

    try {
      const response = await invitationService.getInvitationsByEvent(eventId);
      const invitationData = response.data || [];

      setInvitations(invitationData);

      if (invitationData.length === 0) {
        setInfo("No invitations found for this event yet.");
      }
    } catch (err) {
      console.error("Error fetching invitations by event:", err);
      setError("Failed to fetch invitations for this event.");
      setInvitations([]);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const respondToInvitation = async (invitationId, status) => {
    setError("");
    setMessage("");
    setInfo("");
    setActionLoadingId(invitationId);

    try {
      const payload = {
        status,
        declineReason: status === "DECLINED" ? "Rejected by organizer" : null,
      };

      await invitationService.respondToInvitation(invitationId, payload);

      setMessage(
        status === "ACCEPTED"
          ? "Invitation approved successfully."
          : "Invitation rejected successfully."
      );

      await fetchInvitationsByEvent(selectedEventId);
    } catch (err) {
      console.error("Error updating invitation status:", err);
      setError("Failed to update invitation status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const finalizeInvitation = async (invitation) => {
    setError("");
    setMessage("");
    setInfo("");
    setActionLoadingId(invitation.id);

    try {
      await invitationService.finalizeInvitation(invitation.id);

      setInvitations((prev) =>
        prev.map((item) =>
          item.id === invitation.id
            ? { ...item, status: "FINALIZED" }
            : item
        )
      );

      try {
        await calendarService.addEventToCalendar({
          artistLeadId: invitation.artistLeadId,
          eventId: invitation.eventId,
          eventName: invitation.eventName,
          venue: invitation.venue,
          eventDateTime: invitation.eventDateTime,
        });

        setMessage("Artist finalized and added to calendar.");
      } catch (calendarErr) {
        console.warn("Calendar sync failed:", calendarErr);
        setMessage("Artist finalized successfully. Calendar sync failed.");
      }

      await fetchInvitationsByEvent(selectedEventId);
    } catch (err) {
      console.error("Finalize failed:", err);
      setError("Failed to finalize invitation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
  );

  const allowedLeadsForEvent = useMemo(() => {
    if (!selectedEvent || !selectedEvent.artists) return [];

    const eventArtistNames = selectedEvent.artists
      .split(",")
      .map((name) => normalize(name))
      .filter(Boolean);

    return artistLeads.filter((lead) =>
      eventArtistNames.includes(normalize(lead.artistName))
    );
  }, [selectedEvent, artistLeads]);

  const enrichedInvitations = useMemo(() => {
    return invitations.map((invitation) => {
      const matchedLead = artistLeads.find(
        (lead) => String(lead.id) === String(invitation.artistLeadId)
      );

      return {
        ...invitation,
        lead: matchedLead || null,
      };
    });
  }, [invitations, artistLeads]);

  const invitedLeadIds = useMemo(() => {
    return new Set(
      enrichedInvitations.map((invitation) => String(invitation.artistLeadId))
    );
  }, [enrichedInvitations]);

  const invitedLeads = useMemo(() => {
    return allowedLeadsForEvent.filter((lead) =>
      invitedLeadIds.has(String(lead.id))
    );
  }, [allowedLeadsForEvent, invitedLeadIds]);

  const notInvitedLeads = useMemo(() => {
    return allowedLeadsForEvent.filter(
      (lead) => !invitedLeadIds.has(String(lead.id))
    );
  }, [allowedLeadsForEvent, invitedLeadIds]);

  const finalizedCount = enrichedInvitations.filter(
    (invitation) => invitation.status === "FINALIZED"
  ).length;

  const acceptedCount = enrichedInvitations.filter(
    (invitation) => invitation.status === "ACCEPTED"
  ).length;

  const pendingCount = enrichedInvitations.filter(
    (invitation) => invitation.status === "PENDING"
  ).length;

  const declinedCount = enrichedInvitations.filter(
    (invitation) => invitation.status === "DECLINED"
  ).length;

  return (
    <ArtistModuleLayout
      title="Invitation Tracker"
      subtitle="Track invitation status by event and manage invited artists logically."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div>
          <div className="artist-form-card" style={{ marginBottom: 20 }}>
            <h2 className="artist-form-title">Track Invitations</h2>

            <div className="artist-form-group">
              <label className="artist-form-label">Event</label>
              <select
                className="artist-form-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={loadingEvents}
              >
                <option value="">
                  {loadingEvents
                    ? "Loading events..."
                    : "Select an event..."}
                </option>

                {events.map((event) => (
                  <option key={event.id} value={String(event.id)}>
                    {event.eventName} — {event.venue}
                  </option>
                ))}
              </select>
            </div>

            {message && <p className="artist-form-message success">{message}</p>}
            {error && <p className="artist-form-message error">{error}</p>}
            {info && <p className="artist-form-message">{info}</p>}
          </div>

          {selectedEvent && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>
                Invitations for {selectedEvent.eventName}
              </div>

              {loadingInvitations ? (
                <div className="ah-state">
                  <div className="ah-state-icon">◌</div>
                  Loading...
                </div>
              ) : enrichedInvitations.length > 0 ? (
                enrichedInvitations.map((invitation) => (
                  <div className="ah-card" key={invitation.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div className="ah-card-title">
                          {invitation.artistName ||
                            invitation.lead?.artistName ||
                            "Artist"}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                          {invitation.eventName}
                        </div>
                      </div>
                      {statusBadge(invitation.status)}
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
                        <span className="ah-card-value">{invitation.venue}</span>
                      </div>

                      <div className="ah-card-row">
                        <span className="ah-card-label">Date</span>
                        <span className="ah-card-value">
                          {formatDateTime(invitation.eventDateTime)}
                        </span>
                      </div>

                      <div className="ah-card-row">
                        <span className="ah-card-label">Category</span>
                        <span className="ah-card-value">
                          {invitation.lead?.category || "N/A"}
                        </span>
                      </div>

                      <div className="ah-card-row">
                        <span className="ah-card-label">Lead ID</span>
                        <span className="ah-card-value">
                          {invitation.artistLeadId}
                        </span>
                      </div>
                    </div>

                    {invitation.lead?.email && (
                      <div className="ah-card-row">
                        <span className="ah-card-label">Email</span>
                        <span className="ah-card-value">{invitation.lead.email}</span>
                      </div>
                    )}

                    {invitation.lead?.phoneNumber && (
                      <div className="ah-card-row">
                        <span className="ah-card-label">Phone</span>
                        <span className="ah-card-value">
                          {invitation.lead.phoneNumber}
                        </span>
                      </div>
                    )}

                    {invitation.declineReason &&
                      invitation.declineReason !== "N/A" && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--ah-rose)",
                            marginTop: 8,
                            marginBottom: 8,
                          }}
                        >
                          Decline reason: {invitation.declineReason}
                        </p>
                      )}

                    {invitation.organizerMessage && (
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
                          {invitation.organizerMessage}
                        </div>
                      </div>
                    )}

                    <div className="ah-card-actions" style={{ marginTop: 12 }}>
                      {invitation.status === "PENDING" && (
                        <>
                          <button
                            className="ah-btn ah-btn-primary"
                            onClick={() =>
                              respondToInvitation(invitation.id, "ACCEPTED")
                            }
                            disabled={actionLoadingId === invitation.id}
                            style={{ marginRight: 10 }}
                          >
                            {actionLoadingId === invitation.id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            className="ah-btn"
                            onClick={() =>
                              respondToInvitation(invitation.id, "DECLINED")
                            }
                            disabled={actionLoadingId === invitation.id}
                          >
                            {actionLoadingId === invitation.id
                              ? "Processing..."
                              : "Reject"}
                          </button>
                        </>
                      )}

                      {invitation.status === "ACCEPTED" && (
                        <button
                          className="ah-btn ah-btn-primary"
                          onClick={() => finalizeInvitation(invitation)}
                          disabled={actionLoadingId === invitation.id}
                        >
                          {actionLoadingId === invitation.id
                            ? "Processing..."
                            : "★ Finalize Artist"}
                        </button>
                      )}

                      {invitation.status === "FINALIZED" && (
                        <span className="ah-badge ah-badge-finalized">
                          Already Finalized
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : !loadingInvitations ? (
                <div className="ah-state">
                  <div className="ah-state-icon">⊘</div>
                  No invitations found for this event.
                </div>
              ) : null}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: 20,
                }}
              >
                <div className="ah-card">
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 12,
                      color: "var(--ah-accent-light)",
                    }}
                  >
                    Invited ({invitedLeads.length})
                  </div>

                  {invitedLeads.length === 0 ? (
                    <div className="artist-preview-hint">
                      No invited leads for this event yet.
                    </div>
                  ) : (
                    invitedLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="ah-card"
                        style={{ marginBottom: 10, padding: "12px 14px" }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--ah-text-1)",
                            marginBottom: 4,
                          }}
                        >
                          {lead.artistName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ah-text-3)",
                          }}
                        >
                          {lead.category}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="ah-card">
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 12,
                      color: "#f59e0b",
                    }}
                  >
                    Not Invited ({notInvitedLeads.length})
                  </div>

                  {notInvitedLeads.length === 0 ? (
                    <div className="artist-preview-hint">
                      All valid artist leads for this event have been invited.
                    </div>
                  ) : (
                    notInvitedLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="ah-card"
                        style={{ marginBottom: 10, padding: "12px 14px" }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--ah-text-1)",
                            marginBottom: 4,
                          }}
                        >
                          {lead.artistName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ah-text-3)",
                          }}
                        >
                          {lead.category}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
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
                  <span className="ah-card-label">Valid Leads</span>
                  <span className="ah-card-value">{allowedLeadsForEvent.length}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Invited</span>
                  <span className="ah-card-value">{invitedLeads.length}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Pending</span>
                  <span className="ah-card-value">{pendingCount}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Accepted</span>
                  <span className="ah-card-value">{acceptedCount}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Declined</span>
                  <span className="ah-card-value">{declinedCount}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Finalized</span>
                  <span className="ah-card-value">{finalizedCount}</span>
                </div>
              </div>

              {finalizedCount > 0 && (
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
                    Finalized Artists
                  </div>

                  {enrichedInvitations
                    .filter((invitation) => invitation.status === "FINALIZED")
                    .map((invitation) => (
                      <div
                        key={`finalized-${invitation.id}`}
                        className="ah-card-row"
                        style={{ marginBottom: 6 }}
                      >
                        <span className="ah-card-value">
                          {invitation.artistName ||
                            invitation.lead?.artistName ||
                            "Artist"}
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

export default InvitationTracker;