package backend.ArtistPortal.service;

import backend.Artist.ArtistModel.ArtistInvitation;
import backend.Artist.ArtistRepository.ArtistInvitationRepository;
import backend.Society_Stall.model.EventModel;
import backend.Society_Stall.repository.SocietyEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Service
public class ArtistCalendarInviteService {

    private final ArtistInvitationRepository invitationRepository;
    private final SocietyEventRepository eventRepository;

    public ArtistCalendarInviteService(
            ArtistInvitationRepository invitationRepository,
            SocietyEventRepository eventRepository
    ) {
        this.invitationRepository = invitationRepository;
        this.eventRepository = eventRepository;
    }

    public String generateIcsForInvitation(Long invitationId) {
        ArtistInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with id: " + invitationId));

        if (invitation.getEventId() == null) {
            throw new RuntimeException("Invitation does not have a linked event ID");
        }

        EventModel event = eventRepository.findById(invitation.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + invitation.getEventId()));

        if (event.getEventDate() == null) {
            throw new RuntimeException("Event date is missing");
        }

        if (event.getStartTime() == null) {
            throw new RuntimeException("Event start time is missing");
        }

        if (event.getEndTime() == null) {
            throw new RuntimeException("Event end time is missing");
        }

        LocalDateTime startDateTime = LocalDateTime.of(
                event.getEventDate(),
                event.getStartTime()
        );

        LocalDateTime endDateTime = LocalDateTime.of(
                event.getEventDate(),
                event.getEndTime()
        );

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");

        String dtStamp = LocalDateTime.now(ZoneOffset.UTC).format(formatter) + "Z";
        String dtStart = startDateTime.format(formatter);
        String dtEnd = endDateTime.format(formatter);

        String uid = "artist-invitation-" + invitation.getId() + "@artistportal.local";
        String summary = escapeText(event.getEventName() != null ? event.getEventName() : "Artist Event");
        String location = escapeText(event.getVenue() != null ? event.getVenue() : "TBA");
        String description = escapeText(
                invitation.getOrganizerMessage() != null && !invitation.getOrganizerMessage().isBlank()
                        ? invitation.getOrganizerMessage()
                        : "Artist performance event"
        );

        return "BEGIN:VCALENDAR\r\n" +
                "VERSION:2.0\r\n" +
                "PRODID:-//Artist Portal//EN\r\n" +
                "CALSCALE:GREGORIAN\r\n" +
                "BEGIN:VEVENT\r\n" +
                "UID:" + uid + "\r\n" +
                "DTSTAMP:" + dtStamp + "\r\n" +
                "DTSTART:" + dtStart + "\r\n" +
                "DTEND:" + dtEnd + "\r\n" +
                "SUMMARY:" + summary + "\r\n" +
                "LOCATION:" + location + "\r\n" +
                "DESCRIPTION:" + description + "\r\n" +
                "END:VEVENT\r\n" +
                "END:VCALENDAR\r\n";
    }

    private String escapeText(String value) {
        if (value == null) return "";
        return value
                .replace("\\", "\\\\")
                .replace(",", "\\,")
                .replace(";", "\\;")
                .replace("\n", "\\n")
                .replace("\r", "");
    }
}