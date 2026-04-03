import React, { useEffect, useState } from "react";
import invitationService from "../../services/invitationService";
import calendarService from "../../services/calendarService";
import artistLeadService from "../../services/artistLeadService";
import ArtistModuleLayout from "../../ArtistPages/ArtistModule/ArtistModuleLayout";
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

function InvitationTracker() {
  const [artistLeads, setArtistLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchArtistLeads();
  }, []);

  const fetchArtistLeads = async () => {
    setLoadingLeads(true);
    setError("");
    setMessage("");
    setInfo("");

    try {
      const response = await artistLeadService.getAllLeads();
      setArtistLeads(response.data || []);
    } catch (err) {
      console.error("Error fetching artist leads:", err);
      setError("Failed to load artist leads.");
      setArtistLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchInvitations = async () => {
    setError("");
    setMessage("");
    setInfo("");
    setLoading(true);
    setInvitations([]);

    try {
      if (!selectedLeadId) {
        setError("Please select an artist lead.");
        return;
      }

      const response = await invitationService.getInvitationsByLead(selectedLeadId);
      const invitationData = response.data || [];

      setInvitations(invitationData);

      if (invitationData.length === 0) {
        setInfo("No invitations found for this artist lead.");
      }
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setError("Failed to fetch invitations.");
      setInvitations([]);
    } finally {
      setLoading(false);
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

      await fetchInvitations();
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

      await calendarService.addEventToCalendar({
        artistLeadId: invitation.artistLeadId,
        eventId: invitation.eventId,
        eventName: invitation.eventName,
        venue: invitation.venue,
        eventDateTime: invitation.eventDateTime,
      });

      setMessage("Artist finalized and added to calendar.");
      await fetchInvitations();
    } catch (err) {
      console.error("Error finalizing invitation:", err);
      setError("Failed to finalize invitation or add to calendar.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const selectedLead = artistLeads.find(
    (lead) => String(lead.id) === String(selectedLeadId)
  );

  return (
    <ArtistModuleLayout
      title="Invitation Tracker"
      subtitle="Track invitation status using artist leads added from Add Artist Lead."
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
            <h2 className="artist-form-title">Find Invitations</h2>

            <div className="artist-form-group">
              <label className="artist-form-label">Artist Lead</label>
              <select
                className="artist-form-select"
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                disabled={loadingLeads}
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

            <button
              className="artist-form-button"
              onClick={fetchInvitations}
              disabled={loading || loadingLeads}
            >
              {loading ? "Loading..." : "View Invitations"}
            </button>

            {message && <p className="artist-form-message success">{message}</p>}
            {error && <p className="artist-form-message error">{error}</p>}
            {info && <p className="artist-form-message">{info}</p>}
          </div>

          {loading ? (
            <div className="ah-state">
              <div className="ah-state-icon">◌</div>
              Loading...
            </div>
          ) : invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div className="ah-card" key={invitation.id}>
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
                      {invitation.artistName || selectedLead?.artistName || "Artist"}
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
                </div>

                {invitation.declineReason &&
                  invitation.declineReason !== "N/A" && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--ah-rose)",
                        marginBottom: 8,
                      }}
                    >
                      Decline reason: {invitation.declineReason}
                    </p>
                  )}

                <div className="ah-card-actions" style={{ marginTop: 12 }}>
                  {invitation.status === "PENDING" && (
                    <>
                      <button
                        className="ah-btn ah-btn-primary"
                        onClick={() => respondToInvitation(invitation.id, "ACCEPTED")}
                        disabled={actionLoadingId === invitation.id}
                        style={{ marginRight: 10 }}
                      >
                        {actionLoadingId === invitation.id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        className="ah-btn"
                        onClick={() => respondToInvitation(invitation.id, "DECLINED")}
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
          ) : !loading && selectedLeadId ? (
            <div className="ah-state">
              <div className="ah-state-icon">⊘</div>
              No invitations found.
            </div>
          ) : null}
        </div>

        <div>
          {selectedLead && (
            <>
              <div className="ah-section-heading" style={{ marginTop: 0 }}>
                Preview
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
                  Artist Lead
                </div>

                <div className="ah-card-title">{selectedLead.artistName}</div>

                <div style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
                  {selectedLead.category}
                </div>

                {selectedLead.email && (
                  <div className="ah-card-row" style={{ marginTop: 8 }}>
                    <span className="ah-card-label">Email</span>
                    <span className="ah-card-value">{selectedLead.email}</span>
                  </div>
                )}

                {selectedLead.phoneNumber && (
                  <div className="ah-card-row">
                    <span className="ah-card-label">Phone</span>
                    <span className="ah-card-value">
                      {selectedLead.phoneNumber}
                    </span>
                  </div>
                )}

                {selectedLead.notes && (
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
                      Notes
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--ah-text-2)",
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedLead.notes}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default InvitationTracker;