import React, { useEffect, useState } from "react";
import invitationService from "../../services/invitationService";
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

function FinalizeArtist() {
  const [artistLeads, setArtistLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [finalizedInvitations, setFinalizedInvitations] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    fetchArtistLeads();
  }, []);

  const fetchArtistLeads = async () => {
    setLoadingLeads(true);
    setError("");
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

  const handleLeadChange = async (e) => {
    const value = e.target.value;
    setSelectedLeadId(value);
    setFinalizedInvitations([]);
    setError("");
    setInfo("");

    if (!value) {
      return;
    }

    setLoadingInvitations(true);

    try {
      const response = await invitationService.getInvitationsByLead(value);

      const finalized = (response.data || []).filter(
        (invitation) => invitation.status === "FINALIZED"
      );

      setFinalizedInvitations(finalized);

      if (finalized.length === 0) {
        setInfo("No finalized invitations found for this artist lead.");
      }
    } catch (err) {
      console.error("Error fetching finalized invitations:", err);
      setError("Failed to load finalized invitations.");
      setFinalizedInvitations([]);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const selectedLead = artistLeads.find(
    (lead) => String(lead.id) === String(selectedLeadId)
  );

  return (
    <ArtistModuleLayout
      title="Finalize Artist"
      subtitle="View finalized invitations based on artist leads."
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
          <h2 className="artist-form-title">Find Finalized Artists</h2>

          <p
            style={{
              fontSize: 13,
              color: "var(--ah-text-2)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Select an artist lead to view finalized invitation details.
          </p>

          <div className="artist-form-group">
            <label className="artist-form-label">Artist Lead</label>
            <select
              className="artist-form-select"
              value={selectedLeadId}
              onChange={handleLeadChange}
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

          {error && <p className="artist-form-message error">{error}</p>}
          {info && <p className="artist-form-message">{info}</p>}

          {loadingInvitations ? (
            <div className="ah-state" style={{ marginTop: 20 }}>
              <div className="ah-state-icon">◌</div>
              Loading...
            </div>
          ) : finalizedInvitations.length > 0 ? (
            <div style={{ marginTop: 20 }}>
              {finalizedInvitations.map((invitation) => (
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
                </div>
              ))}
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
                    <span className="ah-card-value">{selectedLead.phoneNumber}</span>
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

export default FinalizeArtist;