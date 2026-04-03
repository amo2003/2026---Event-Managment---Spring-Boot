import React, { useContext, useEffect, useState } from "react";
import invitationService from "../../services/invitationService";
import { AuthContext } from "../../context/AuthContext";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function statusBadge(status) {
  const s = status?.toLowerCase();
  return <span className={`ah-badge ah-badge-${s}`}>{status}</span>;
}

function ArtistInvitations() {
  const { user } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const artistId = user?.userType === "artist" ? user.id : null;

  const fetchInvitations = async () => {
    if (!artistId) { setError("Artist login required."); setLoading(false); return; }
    setError("");
    try {
      const response = await invitationService.getInvitationsByArtist(artistId);
      setInvitations(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch invitations");
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (id, status) => {
    try {
      await invitationService.respondToInvitation(id, {
        status,
        declineReason: status === "DECLINED" ? "I am unavailable on this date." : "",
      });
      fetchInvitations();
    } catch (err) {
      console.error(err);
      alert("Failed to respond to invitation");
    }
  };

  useEffect(() => { fetchInvitations(); }, [artistId]);

  const pending  = invitations.filter((i) => i.status === "PENDING").length;
  const accepted = invitations.filter((i) => i.status === "ACCEPTED").length;
  const declined = invitations.filter((i) => i.status === "DECLINED").length;

  return (
    <ArtistModuleLayout title="My Invitations" subtitle="Formal performance invitations from organizers.">
      {error && <div className="ah-error">{error}</div>}

      {!loading && invitations.length > 0 && (
        <div className="ah-stats-grid">
          <div className="ah-stat">
            <div className="ah-stat-label">Total</div>
            <div className="ah-stat-value accent">{invitations.length}</div>
          </div>
          <div className="ah-stat">
            <div className="ah-stat-label">Pending</div>
            <div className="ah-stat-value amber">{pending}</div>
          </div>
          <div className="ah-stat">
            <div className="ah-stat-label">Accepted</div>
            <div className="ah-stat-value green">{accepted}</div>
          </div>
          <div className="ah-stat">
            <div className="ah-stat-label">Declined</div>
            <div className="ah-stat-value rose">{declined}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="ah-state"><div className="ah-state-icon">◌</div>Loading invitations…</div>
      ) : invitations.length === 0 ? (
        <div className="ah-state"><div className="ah-state-icon">⊘</div>No invitations found.</div>
      ) : (
        invitations.map((invitation) => (
          <div className="ah-card" key={invitation.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div className="ah-card-title">{invitation.eventName}</div>
              {statusBadge(invitation.status)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", marginBottom: 8 }}>
              <div className="ah-card-row">
                <span className="ah-card-label">Venue</span>
                <span className="ah-card-value">{invitation.venue}</span>
              </div>
              <div className="ah-card-row">
                <span className="ah-card-label">Date</span>
                <span className="ah-card-value">{invitation.eventDateTime}</span>
              </div>
            </div>

            {invitation.organizerMessage && (
              <p style={{ fontSize: 12, color: "var(--ah-text-2)", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "var(--ah-radius-sm)", borderLeft: "2px solid var(--ah-accent)", marginBottom: 8 }}>
                "{invitation.organizerMessage}"
              </p>
            )}

            {invitation.declineReason && invitation.declineReason !== "N/A" && (
              <p style={{ fontSize: 12, color: "var(--ah-rose)", marginBottom: 8 }}>
                Decline reason: {invitation.declineReason}
              </p>
            )}

            {invitation.status === "PENDING" && (
              <div className="ah-card-actions">
                <button className="ah-btn ah-btn-success" onClick={() => respondToInvitation(invitation.id, "ACCEPTED")}>
                  ✓ Accept
                </button>
                <button className="ah-btn ah-btn-danger" onClick={() => respondToInvitation(invitation.id, "DECLINED")}>
                  ✕ Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistInvitations;