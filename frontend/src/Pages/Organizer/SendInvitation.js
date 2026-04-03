import React, { useEffect, useState } from "react";
import invitationService from "../../services/invitationService";
import artistLeadService from "../../services/artistLeadService";
import eventService from "../../services/eventService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

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

  useEffect(() => {
    loadArtistLeads();
    loadEvents();
  }, []);

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

  try {
    const response = await eventService.getAllEvents();
    const eventData = response.data || [];

    if (eventData.length === 0) {
      setEvents([
        {
          id: 999,
          eventName: "Test Music Night",
          venue: "SLIIT Main Hall",
          eventDate: "2026-04-10",
          startTime: "18:00:00",
        },
      ]);
      setError("No backend events found. Using a temporary test event.");
    } else {
      setEvents(eventData);
    }
  } catch (err) {
    console.error("Error loading events:", err);

    setEvents([
      {
        id: 999,
        eventName: "Test Music Night",
        venue: "SLIIT Main Hall",
        eventDate: "2026-04-10",
        startTime: "18:00:00",
      },
    ]);

    setError("Events module is unavailable. Using a temporary test event.");
  } finally {
    setLoadingEvents(false);
  }
};

  const selectedLead = artistLeads.find(
    (lead) => String(lead.id) === String(selectedLeadId)
  );

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId)
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

      setSelectedLeadId("");
      setSelectedEventId("");
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
        <div className="artist-form-card">
          <h2 className="artist-form-title">New Invitation</h2>

          <form onSubmit={handleSubmit}>
            <div className="artist-form-group">
              <label className="artist-form-label">Artist Lead</label>
              <select
                className="artist-form-select"
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                disabled={loadingLeads}
                required
              >
                <option value="">
                  {loadingLeads
                    ? "Loading artist leads..."
                    : "Select an artist lead..."}
                </option>
                {artistLeads.map((lead) => (
                  <option key={lead.id} value={String(lead.id)}>
                    {lead.artistName} — {lead.category}
                  </option>
                ))}
              </select>
            </div>

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
              <label className="artist-form-label">Message</label>
              <textarea
                className="artist-form-textarea"
                value={organizerMessage}
                onChange={(e) => setOrganizerMessage(e.target.value)}
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="artist-form-button"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Invitation"}
            </button>
          </form>

          {message && <p className="artist-form-message success">{message}</p>}
          {error && <p className="artist-form-message error">{error}</p>}
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
            </>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default SendInvitation;