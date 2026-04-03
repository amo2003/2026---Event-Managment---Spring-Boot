import React, { useEffect, useState } from "react";
import inquiryService from "../../services/inquiryService";
import artistService from "../../services/artistService";
import artistLeadService from "../../services/artistLeadService";
import eventService from "../../services/eventService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function SendInquiry() {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [organizerMessage, setOrganizerMessage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetchArtistsAndLeads();
    fetchEvents();
  }, []);

  const fetchArtistsAndLeads = async () => {
    try {
      setLoadingArtists(true);

      const [artistsResponse, leadsResponse] = await Promise.allSettled([
        artistService.getAllArtists(),
        artistLeadService.getAllLeads(),
      ]);

      const artistsData =
        artistsResponse.status === "fulfilled"
          ? artistsResponse.value?.data || []
          : [];

      const leadsData =
        leadsResponse.status === "fulfilled"
          ? leadsResponse.value?.data || []
          : [];

      const normalizedArtists = artistsData.map((artist) => ({
        ...artist,
        sourceType: "ARTIST",
        uniqueKey: `artist-${artist.id}`,
        displayId: `artist-${artist.id}`,
      }));

      const normalizedLeads = leadsData.map((lead) => ({
        ...lead,
        sourceType: "LEAD",
        uniqueKey: `lead-${lead.id}`,
        displayId: `lead-${lead.id}`,
      }));

      const merged = [...normalizedArtists, ...normalizedLeads];

      setArtists(merged);
    } catch (err) {
      console.error("Error fetching artists and leads:", err);
      setError("Failed to load artists.");
    } finally {
      setLoadingArtists(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await eventService.getAllEvents();
      setEvents(response.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const selectedArtist = artists.find(
    (a) => String(a.displayId) === String(selectedArtistId)
  );

  const selectedEvent = events.find(
    (ev) => String(ev.id) === String(selectedEventId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedArtist || !selectedEvent) {
      setError("Please select both an artist and an event.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        artistId: selectedArtist.id,
        eventId: selectedEvent.id,
        eventName: selectedEvent.eventName,
        venue: selectedEvent.venue,
        eventDateTime: selectedEvent.eventDate
          ? `${selectedEvent.eventDate}T${selectedEvent.startTime || "18:00:00"}`
          : selectedEvent.eventDateTime,
        organizerMessage: organizerMessage.trim(),
      };

      await inquiryService.sendInquiry(payload);
      setMessage("Inquiry sent successfully.");
      setSelectedArtistId("");
      setSelectedEventId("");
      setOrganizerMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to send inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ArtistModuleLayout
      title="Send Inquiry"
      subtitle="Check an artist's availability before sending a formal invitation."
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
          <h2 className="artist-form-title">New Inquiry</h2>

          <form onSubmit={handleSubmit}>
            <div className="artist-form-group">
              <label className="artist-form-label">Artist</label>
              <select
                className="artist-form-select"
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                required
                disabled={loadingArtists}
              >
                <option value="">
                  {loadingArtists ? "Loading artists..." : "Select an artist…"}
                </option>

                {artists.map((a) => (
                  <option key={a.uniqueKey} value={a.displayId}>
                    {a.artistName} — {a.category}
                    {a.sourceType === "LEAD" ? " (Lead)" : ""}
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
                required
                disabled={loadingEvents}
              >
                <option value="">
                  {loadingEvents ? "Loading events..." : "Select an event…"}
                </option>

                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName} — {ev.venue}
                  </option>
                ))}
              </select>
            </div>

            <div className="artist-form-group">
              <label className="artist-form-label">Message to Artist</label>
              <textarea
                className="artist-form-textarea"
                value={organizerMessage}
                onChange={(e) => setOrganizerMessage(e.target.value)}
                placeholder="Hi, are you available to perform at our upcoming event?"
                style={{ minHeight: 100 }}
              />
            </div>

            <button
              type="submit"
              className="artist-form-button"
              disabled={submitting || loadingArtists || loadingEvents}
            >
              {submitting ? "Sending…" : "Send Inquiry"}
            </button>
          </form>

          {message && <p className="artist-form-message success">{message}</p>}
          {error && <p className="artist-form-message error">{error}</p>}
        </div>

        <div>
          {(selectedArtist || selectedEvent) && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>
                Preview
              </div>

              {selectedArtist && (
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
                    Artist
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ah-text-1)",
                      marginBottom: 4,
                    }}
                  >
                    {selectedArtist.artistName}
                  </div>

                  <span
                    style={{
                      background: "var(--ah-accent-dim)",
                      color: "var(--ah-accent-light)",
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    {selectedArtist.category}
                    {selectedArtist.sourceType === "LEAD" ? " • Lead" : ""}
                  </span>

                  {selectedArtist.email && (
                    <div className="ah-card-row" style={{ marginTop: 8 }}>
                      <span className="ah-card-label">Email</span>
                      <span className="ah-card-value">{selectedArtist.email}</span>
                    </div>
                  )}

                  {selectedArtist.phoneNumber && (
                    <div className="ah-card-row">
                      <span className="ah-card-label">Phone</span>
                      <span className="ah-card-value">
                        {selectedArtist.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {selectedEvent && (
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
                    Event
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ah-text-1)",
                      marginBottom: 8,
                    }}
                  >
                    {selectedEvent.eventName}
                  </div>

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
            </>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default SendInquiry;