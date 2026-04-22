import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inquiryService from "../../services/inquiryService";
import invitationService from "../../services/invitationService";
import calendarService from "../../services/calendarService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "./artistDashboardModern.css";

function ArtistDashboard() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const artistId = 1;

  useEffect(() => {
    Promise.all([
      inquiryService.getInquiriesByArtist(artistId).catch(() => ({ data: [] })),
      invitationService.getInvitationsByArtist(artistId).catch(() => ({ data: [] })),
      calendarService.getCalendarByArtist(artistId).catch(() => ({ data: [] })),
    ])
      .then(([iq, inv, cal]) => {
        setInquiries(iq.data || []);
        setInvitations(inv.data || []);
        setCalendarEvents(cal.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingInquiries = inquiries.filter((i) => i.status === "PENDING").length;
  const pendingInvitations = invitations.filter((i) => i.status === "PENDING").length;
  const acceptedInvitations = invitations.filter((i) => i.status === "ACCEPTED").length;
  const upcomingEvents = calendarEvents.length;

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <ArtistModuleLayout>
      <div className="dashboard-modern">
        
        {/* HERO SECTION */}
        <div className="dashboard-hero">
          <div>
            <span className="dashboard-tag">ARTIST PANEL</span>
            <h1>Manage Your Events & Invitations</h1>
            <p>
              Track your inquiries, manage invitations and stay updated with your
              performance schedule.
            </p>

            <div className="dashboard-actions">
              <button onClick={() => navigate("/artist/inquiries")}>
                View Inquiries →
              </button>
              <button className="outline" onClick={() => navigate("/artist/calendar")}>
                My Calendar
              </button>
            </div>
          </div>

          <div className="dashboard-highlights">
            <div>
              🎤 <span>{pendingInquiries} Pending Inquiries</span>
            </div>
            <div>
              📩 <span>{pendingInvitations} Invitations</span>
            </div>
            <div>
              ✅ <span>{acceptedInvitations} Accepted</span>
            </div>
            <div>
              📅 <span>{upcomingEvents} Events</span>
            </div>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="dashboard-grid">
          
          {/* INQUIRIES */}
          <div className="dashboard-card">
            <h3>Recent Inquiries</h3>

            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="dashboard-item">
                <div>
                  <strong>{inq.eventName}</strong>
                  <p>{inq.venue}</p>
                </div>
                <span className={`status ${inq.status.toLowerCase()}`}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>

          {/* INVITATIONS */}
          <div className="dashboard-card">
            <h3>Recent Invitations</h3>

            {invitations.slice(0, 3).map((inv) => (
              <div key={inv.id} className="dashboard-item">
                <div>
                  <strong>{inv.eventName}</strong>
                  <p>{inv.venue}</p>
                </div>
                <span className={`status ${inv.status.toLowerCase()}`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* EVENTS */}
        <div className="dashboard-card full">
          <h3>Upcoming Events</h3>

          {calendarEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="dashboard-event">
              <span>📅</span>
              <div>
                <strong>{event.eventName}</strong>
                <p>{event.venue} · {event.eventDateTime}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ArtistModuleLayout>
  );
}

export default ArtistDashboard;