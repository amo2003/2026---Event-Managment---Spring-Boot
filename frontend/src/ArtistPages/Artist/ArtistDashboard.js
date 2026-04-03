import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inquiryService from "../../services/inquiryService";
import invitationService from "../../services/invitationService";
import calendarService from "../../services/calendarService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function ArtistDashboard() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Temporary static artist ID for dashboard visualization
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
  }, [artistId]);

  const pendingInquiries = inquiries.filter((i) => i.status === "PENDING").length;
  const pendingInvitations = invitations.filter((i) => i.status === "PENDING").length;
  const acceptedInvitations = invitations.filter((i) => i.status === "ACCEPTED").length;
  const upcomingEvents = calendarEvents.length;

  const recentInquiries = inquiries.slice(0, 3);
  const recentInvitations = invitations.slice(0, 3);

  function statusBadge(status) {
    const s = status?.toLowerCase();
    return <span className={`ah-badge ah-badge-${s}`}>{status}</span>;
  }

  return (
    <ArtistModuleLayout
      title="Artist Dashboard"
      subtitle="Here's an overview of your current activity."
    >
      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading dashboard…
        </div>
      ) : (
        <>
          <div className="ah-stats-grid">
            <div className="ah-stat">
              <div className="ah-stat-label">Pending Inquiries</div>
              <div className="ah-stat-value amber">{pendingInquiries}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Pending Invitations</div>
              <div className="ah-stat-value accent">{pendingInvitations}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Accepted</div>
              <div className="ah-stat-value green">{acceptedInvitations}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Calendar Events</div>
              <div className="ah-stat-value teal">{upcomingEvents}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <button
              className="ah-btn ah-btn-primary"
              onClick={() => navigate("/artist/inquiries")}
            >
              View All Inquiries
            </button>
            <button
              className="ah-btn"
              onClick={() => navigate("/artist/invitations")}
            >
              View Invitations
            </button>
            <button
              className="ah-btn"
              onClick={() => navigate("/artist/calendar")}
            >
              My Calendar
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div className="ah-section-heading">Recent Inquiries</div>
              {recentInquiries.length === 0 ? (
                <div className="ah-state" style={{ padding: "24px 0" }}>
                  No inquiries yet.
                </div>
              ) : (
                recentInquiries.map((inq) => (
                  <div className="ah-card" key={inq.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--ah-text-1)",
                        }}
                      >
                        {inq.eventName}
                      </span>
                      {statusBadge(inq.status)}
                    </div>
                    <div className="ah-card-row">
                      <span className="ah-card-label">Venue</span>
                      <span className="ah-card-value">{inq.venue}</span>
                    </div>
                    <div className="ah-card-row">
                      <span className="ah-card-label">Date</span>
                      <span className="ah-card-value">{inq.eventDateTime}</span>
                    </div>
                  </div>
                ))
              )}
              {inquiries.length > 3 && (
                <button
                  className="ah-btn"
                  style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
                  onClick={() => navigate("/artist/inquiries")}
                >
                  See all {inquiries.length} inquiries →
                </button>
              )}
            </div>

            <div>
              <div className="ah-section-heading">Recent Invitations</div>
              {recentInvitations.length === 0 ? (
                <div className="ah-state" style={{ padding: "24px 0" }}>
                  No invitations yet.
                </div>
              ) : (
                recentInvitations.map((inv) => (
                  <div className="ah-card" key={inv.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--ah-text-1)",
                        }}
                      >
                        {inv.eventName}
                      </span>
                      {statusBadge(inv.status)}
                    </div>
                    <div className="ah-card-row">
                      <span className="ah-card-label">Venue</span>
                      <span className="ah-card-value">{inv.venue}</span>
                    </div>
                    <div className="ah-card-row">
                      <span className="ah-card-label">Date</span>
                      <span className="ah-card-value">{inv.eventDateTime}</span>
                    </div>
                  </div>
                ))
              )}
              {invitations.length > 3 && (
                <button
                  className="ah-btn"
                  style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
                  onClick={() => navigate("/artist/invitations")}
                >
                  See all {invitations.length} invitations →
                </button>
              )}
            </div>
          </div>

          {calendarEvents.length > 0 && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 28 }}>
                Upcoming Calendar Events
              </div>
              {calendarEvents.slice(0, 3).map((event) => (
                <div
                  className="ah-card"
                  key={event.id}
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--ah-radius-sm)",
                      background: "var(--ah-accent-dim)",
                      border: "1px solid rgba(139,92,246,.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    📅
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ah-text-1)",
                        marginBottom: 2,
                      }}
                    >
                      {event.eventName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                      {event.venue} · {event.eventDateTime}
                    </div>
                  </div>
                  <span
                    className={`ah-badge ${
                      event.syncStatus === "SYNCED"
                        ? "ah-badge-synced"
                        : "ah-badge-pending"
                    }`}
                  >
                    {event.syncStatus}
                  </span>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistDashboard;