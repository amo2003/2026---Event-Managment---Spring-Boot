import React, { useEffect, useMemo, useState } from "react";
import calendarService from "../../services/calendarService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function combineDateTime(date, time) {
  if (!date) return null;
  if (!time) return `${date}T00:00:00`;
  return `${date}T${time}`;
}

function formatDateTime(value) {
  if (!value) return "N/A";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function splitArtistsString(value = "") {
  return String(value)
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

function CalendarStatus() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    setError("");
    setLoading(true);

    try {
      const [eventsResponse, leadsResponse] = await Promise.all([
        calendarService.getAllEvents(),
        calendarService.getAllLeads(),
      ]);

      const allEvents = eventsResponse.data || [];
      const allLeads = leadsResponse.data || [];

      const visibleEvents = allEvents.filter((event) => {
        const status = String(event.status || "").trim().toUpperCase();
        return status === "CONFIRMED" || status === "APPROVED";
      });

      const enrichedEvents = await Promise.all(
        visibleEvents.map(async (event) => {
          try {
            const invitationResponse = await calendarService.getInvitationsByEvent(
              event.id
            );
            const invitations = invitationResponse.data || [];

            const finalizedInvitations = invitations.filter(
              (invitation) =>
                String(invitation.status || "").trim().toUpperCase() ===
                "FINALIZED"
            );

            const finalizedArtistNames = finalizedInvitations
              .map((invitation) => {
                const matchedLead = allLeads.find(
                  (lead) => String(lead.id) === String(invitation.artistLeadId)
                );

                return (
                  invitation.artistName ||
                  matchedLead?.artistName ||
                  ""
                ).trim();
              })
              .filter(Boolean);

            const uniqueFinalizedArtistNames = [...new Set(finalizedArtistNames)];
            const fallbackArtistNames = splitArtistsString(event.artists);

            const artistsToShow =
              uniqueFinalizedArtistNames.length > 0
                ? uniqueFinalizedArtistNames
                : fallbackArtistNames;

            return {
              ...event,
              artistsDisplay: artistsToShow.join(", ") || "No artists assigned",
              artistsList: artistsToShow,
              finalizedArtistsCount: uniqueFinalizedArtistNames.length,
            };
          } catch (invitationErr) {
            console.error(
              `Failed to load invitations for event ${event.id}:`,
              invitationErr
            );

            const fallbackArtistNames = splitArtistsString(event.artists);

            return {
              ...event,
              artistsDisplay: fallbackArtistNames.join(", ") || "No artists assigned",
              artistsList: fallbackArtistNames,
              finalizedArtistsCount: 0,
            };
          }
        })
      );

      setCalendarEvents(enrichedEvents);
    } catch (err) {
      console.error("Failed to fetch calendar data:", err);
      setError("Failed to fetch calendar events");
      setCalendarEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const mappedEvents = useMemo(() => {
    return calendarEvents.map((event) => ({
      id: String(event.id),
      title: event.eventName || "Untitled Event",
      start: combineDateTime(event.eventDate, event.startTime),
      end: combineDateTime(event.eventDate, event.endTime),
      extendedProps: {
        venue: event.venue || "N/A",
        artistsDisplay: event.artistsDisplay || "No artists assigned",
        artistsList: event.artistsList || [],
        societyName: event.societyName || "N/A",
        contactNumber: event.contactNumber || "N/A",
        description: event.description || "No description available",
        status: event.status || "N/A",
        finalizedArtistsCount: event.finalizedArtistsCount || 0,
      },
    }));
  }, [calendarEvents]);

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setSelectedEvent({
      id: event.id,
      eventName: event.title,
      venue: event.extendedProps.venue,
      artistsDisplay: event.extendedProps.artistsDisplay,
      artistsList: event.extendedProps.artistsList,
      societyName: event.extendedProps.societyName,
      contactNumber: event.extendedProps.contactNumber,
      description: event.extendedProps.description,
      status: event.extendedProps.status,
      finalizedArtistsCount: event.extendedProps.finalizedArtistsCount,
      start: event.start,
      end: event.end,
    });
  };

  return (
    <ArtistModuleLayout
      title="Calendar Status"
      subtitle="View all confirmed events in calendar format."
    >
      {error && <div className="ah-error">{error}</div>}

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading…
        </div>
      ) : calendarEvents.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No confirmed events found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div className="ah-card" style={{ padding: 16 }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={mappedEvents}
              eventClick={handleEventClick}
              height="auto"
              dayMaxEvents={true}
            />
          </div>

          <div>
            <div className="ah-section-heading" style={{ marginTop: 0 }}>
              Event Details
            </div>

            {selectedEvent ? (
              <div className="ah-card">
                <div className="ah-card-title">{selectedEvent.eventName}</div>

                <div className="ah-card-row" style={{ marginTop: 10 }}>
                  <span className="ah-card-label">Venue</span>
                  <span className="ah-card-value">{selectedEvent.venue}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Start</span>
                  <span className="ah-card-value">
                    {formatDateTime(selectedEvent.start)}
                  </span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">End</span>
                  <span className="ah-card-value">
                    {formatDateTime(selectedEvent.end)}
                  </span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Society</span>
                  <span className="ah-card-value">{selectedEvent.societyName}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Status</span>
                  <span className="ah-card-value">{selectedEvent.status}</span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Artists</span>
                  <span className="ah-card-value">
                    {selectedEvent.artistsDisplay}
                  </span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Finalized Artists</span>
                  <span className="ah-card-value">
                    {selectedEvent.finalizedArtistsCount > 0
                      ? selectedEvent.finalizedArtistsCount
                      : "Using event list"}
                  </span>
                </div>

                <div className="ah-card-row">
                  <span className="ah-card-label">Contact</span>
                  <span className="ah-card-value">
                    {selectedEvent.contactNumber}
                  </span>
                </div>

                <div style={{ marginTop: 12 }}>
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
                    Description
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ah-text-2)",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedEvent.description}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ah-card">
                <div style={{ fontSize: 13, color: "var(--ah-text-2)" }}>
                  Click an event on the calendar to view details and artist lineup.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ArtistModuleLayout>
  );
}

export default CalendarStatus;