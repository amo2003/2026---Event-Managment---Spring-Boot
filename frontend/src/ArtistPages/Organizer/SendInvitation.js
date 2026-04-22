import React, { useEffect, useMemo, useState } from "react";
import invitationService from "../../services/invitationService";
import artistLeadService from "../../services/artistLeadService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";
import axios from "axios";

function normalize(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function SendInvitation() {
  const [artistLeads, setArtistLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [organizerMessage, setOrganizerMessage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingInviteStatus, setLoadingInviteStatus] = useState(false);
  const [eventInvitations, setEventInvitations] = useState([]);

  useEffect(() => {
    loadArtistLeads();
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadInvitationsByEvent(selectedEventId);
    } else {
      setEventInvitations([]);
    }

    // reset selected lead when event changes
    setSelectedLeadId("");
    setMessage("");
    setError("");
  }, [selectedEventId]);

  const loadArtistLeads = async () => {
    setLoadingLeads(true);
    setError("");

    try {
      const response = await artistLeadService.getAllLeads();
      setArtistLeads(response.data || []);
    } catch (err) {
      console.error("Error loading artist leads:", err);
      setError("Failed to load artist leads.");
      setArtistLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:8080/api/admin/events");
      const eventData = response.data || [];

      if (eventData.length === 0) {
        setEvents([]);
        setError("No events found.");
      } else {
        setEvents(eventData);
      }
    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
      setError("Failed to load events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadInvitationsByEvent = async (eventId) => {
    setLoadingInviteStatus(true);

    try {
      const response = await invitationService.getInvitationsByEvent(eventId);
      setEventInvitations(response.data || []);
    } catch (err) {
      console.error("Error loading invitations by event:", err);
      setEventInvitations([]);
    } finally {
      setLoadingInviteStatus(false);
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

  const selectedLead = allowedLeadsForEvent.find(
    (lead) => String(lead.id) === String(selectedLeadId)
  );

  const buildEventDateTime = () => {
    if (!selectedEvent) return "";

    if (selectedEvent.eventDate && selectedEvent.startTime) {
      return `${selectedEvent.eventDate}T${selectedEvent.startTime}`;
    }

    if (selectedEvent.eventDate) {
      return `${selectedEvent.eventDate}T18:00:00`;
    }

    return selectedEvent.eventDateTime || "";
  };

  const buildDisplayDate = () => {
    if (!selectedEvent) return "";

    if (selectedEvent.eventDate && selectedEvent.startTime) {
      return `${selectedEvent.eventDate} ${selectedEvent.startTime}`;
    }

    if (selectedEvent.eventDate) {
      return selectedEvent.eventDate;
    }

    return selectedEvent.eventDateTime || "";
  };

  const openEmailClient = () => {
    if (!selectedLead || !selectedEvent || !selectedLead.email) return;

    const subject = encodeURIComponent(
      `Invitation to perform at ${selectedEvent.eventName}`
    );

    const body = encodeURIComponent(
`Hi ${selectedLead.artistName},

You are formally invited to perform at our upcoming event.

Event: ${selectedEvent.eventName}
Venue: ${selectedEvent.venue}
Date: ${buildDisplayDate()}

${organizerMessage ? organizerMessage + "\n\n" : ""}Looking forward to your response.

Best regards,
Event Organizer`
    );

    window.location.href = `mailto:${selectedLead.email}?subject=${subject}&body=${body}`;
  };

  const invitedLeadIds = useMemo(() => {
    return new Set(
      (eventInvitations || []).map((inv) => String(inv.artistLeadId))
    );
  }, [eventInvitations]);

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

  const selectedLeadAlreadyInvited = selectedLead
    ? invitedLeadIds.has(String(selectedLead.id))
    : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedLeadId || !selectedEventId) {
      setError("Please select both an artist lead and an event.");
      return;
    }

    if (!selectedLead || !selectedEvent) {
      setError("Selected artist lead or event could not be found.");
      return;
    }

    const alreadyInvited = eventInvitations.some(
      (inv) => String(inv.artistLeadId) === String(selectedLead.id)
    );

    if (alreadyInvited) {
      setError("This artist lead has already been invited to the selected event.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        artistLeadId: selectedLead.id,
        eventId: selectedEvent.id,
        eventName: selectedEvent.eventName,
        venue: selectedEvent.venue,
        eventDateTime: buildEventDateTime(),
        organizerMessage,
      };

      await invitationService.sendInvitation(payload);

      if (selectedLead.email) {
        openEmailClient();
        setMessage("Invitation saved and email opened.");
      } else {
        setMessage("Invitation saved successfully.");
      }

      await loadInvitationsByEvent(selectedEvent.id);

      setSelectedLeadId("");
      setOrganizerMessage("");
    } catch (err) {
      console.error("Error sending invitation:", err);
      setError("Failed to send invitation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ArtistModuleLayout
      title="Send Invitation"
      subtitle="Invite an artist lead to perform at your event."
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
          <div className="artist-form-card">
            <h2 className="artist-form-title">New Invitation</h2>

            <form onSubmit={handleSubmit}>
              <div className="artist-form-group">
                <label className="artist-form-label">Event</label>
                <select
                  className="artist-form-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  disabled={loadingEvents}
                  required
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

              <div className="artist-form-group">
                <label className="artist-form-label">Artist Lead</label>
                <select
                  className="artist-form-select"
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  disabled={loadingLeads || !selectedEventId}
                  required
                >
                  <option value="">
                    {!selectedEventId
                      ? "Select an event first..."
                      : loadingLeads
                      ? "Loading artist leads..."
                      : "Select an artist lead..."}
                  </option>
                  {allowedLeadsForEvent.map((lead) => (
                    <option key={lead.id} value={String(lead.id)}>
                      {lead.artistName} — {lead.category}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && allowedLeadsForEvent.length === 0 && (
                <p className="artist-form-message error">
                  No valid artist leads found for this event. Please add them from Add Artist Lead.
                </p>
              )}

              <div className="artist-form-group">
                <label className="artist-form-label">Message</label>
                <textarea
                  className="artist-form-textarea"
                  value={organizerMessage}
                  onChange={(e) => setOrganizerMessage(e.target.value)}
                  placeholder="Write your message..."
                />
              </div>

              {selectedLead && selectedEvent && selectedLeadAlreadyInvited && (
                <p className="artist-form-message error">
                  This artist has already been invited to this event.
                </p>
              )}

              <button
                type="submit"
                className="artist-form-button"
                disabled={
                  submitting ||
                  !selectedEventId ||
                  !selectedLeadId ||
                  selectedLeadAlreadyInvited
                }
              >
                {submitting ? "Sending..." : "Send Invitation"}
              </button>
            </form>

            {message && <p className="artist-form-message success">{message}</p>}
            {error && <p className="artist-form-message error">{error}</p>}
          </div>

          {selectedEvent && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 20 }}>
                Invitation Status for {selectedEvent.eventName}
              </div>

              {loadingInviteStatus ? (
                <div className="ah-state">
                  <div className="ah-state-icon">◌</div>
                  Loading invitation status...
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
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
                        No invites sent yet.
                      </div>
                    ) : (
                      invitedLeads.map((lead) => {
                        const latestInvite = eventInvitations
                          .filter(
                            (inv) => String(inv.artistLeadId) === String(lead.id)
                          )
                          .sort(
                            (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
                          )[0];

                        return (
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
                                marginBottom: 6,
                              }}
                            >
                              {lead.category}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--ah-accent-light)",
                              }}
                            >
                              Status: {latestInvite?.status || "SENT"}
                            </div>
                          </div>
                        );
                      })
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
              )}
            </>
          )}
        </div>

        <div>
          {(selectedLead || selectedEvent || organizerMessage) && (
            <>
              <div className="ah-section-heading">Preview</div>

              {selectedLead && (
                <div className="ah-card">
                  <b>{selectedLead.artistName}</b>
                  <div>{selectedLead.category}</div>
                  {selectedLead.email && <div>{selectedLead.email}</div>}
                  {selectedLead.phoneNumber && <div>{selectedLead.phoneNumber}</div>}
                </div>
              )}

              {selectedEvent && (
                <div className="ah-card">
                  <b>{selectedEvent.eventName}</b>
                  <div>{selectedEvent.venue}</div>
                  <div>{buildDisplayDate()}</div>
                </div>
              )}

              {organizerMessage && (
                <div className="ah-card">
                  <i>"{organizerMessage}"</i>
                </div>
              )}

              {selectedEvent && (
                <div className="ah-card">
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 10,
                      color: "var(--ah-text-1)",
                    }}
                  >
                    Quick Summary
                  </div>
                  <div className="ah-card-row">
                    <span className="ah-card-label">Valid Leads</span>
                    <span className="ah-card-value">{allowedLeadsForEvent.length}</span>
                  </div>
                  <div className="ah-card-row">
                    <span className="ah-card-label">Invited</span>
                    <span className="ah-card-value">{invitedLeads.length}</span>
                  </div>
                  <div className="ah-card-row">
                    <span className="ah-card-label">Not Invited</span>
                    <span className="ah-card-value">{notInvitedLeads.length}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default SendInvitation;