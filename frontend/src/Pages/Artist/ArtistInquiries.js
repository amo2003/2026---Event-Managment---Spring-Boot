import React, { useContext, useEffect, useState } from "react";
import inquiryService from "../../services/inquiryService";
import { AuthContext } from "../../context/AuthContext";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function statusBadge(status) {
  const s = status?.toLowerCase();
  return <span className={`ah-badge ah-badge-${s}`}>{status}</span>;
}

function ArtistInquiries() {
  const { user } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const artistId = user?.userType === "artist" ? user.id : null;

  const fetchInquiries = async () => {
    if (!artistId) { setError("Artist login required."); setLoading(false); return; }
    setError("");
    try {
      const response = await inquiryService.getInquiriesByArtist(artistId);
      setInquiries(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const respondToInquiry = async (id, status) => {
    try {
      await inquiryService.respondToInquiry(id, {
        status,
        responseMessage:
          status === "INTERESTED"
            ? "Yes, I am interested in this event."
            : "Sorry, I am not available for this event.",
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert("Failed to respond to inquiry");
    }
  };

  useEffect(() => { fetchInquiries(); }, [artistId]);

  const pending = inquiries.filter((i) => i.status === "PENDING").length;
  const interested = inquiries.filter((i) => i.status === "INTERESTED").length;
  const notInterested = inquiries.filter((i) => i.status === "NOT_INTERESTED").length;

  return (
    <ArtistModuleLayout title="My Inquiries" subtitle="Event availability inquiries sent to you.">
      {error && <div className="ah-error">{error}</div>}

      {!loading && inquiries.length > 0 && (
        <div className="ah-stats-grid">
          <div className="ah-stat">
            <div className="ah-stat-label">Total</div>
            <div className="ah-stat-value accent">{inquiries.length}</div>
          </div>
          <div className="ah-stat">
            <div className="ah-stat-label">Pending</div>
            <div className="ah-stat-value amber">{pending}</div>
          </div>
          <div className="ah-stat">
            <div className="ah-stat-label">Interested</div>
            <div className="ah-stat-value green">{interested}</div>
          </div>
          <div className="ah-stat">
            <div className="ah-stat-label">Declined</div>
            <div className="ah-stat-value rose">{notInterested}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="ah-state"><div className="ah-state-icon">◌</div>Loading inquiries…</div>
      ) : inquiries.length === 0 ? (
        <div className="ah-state"><div className="ah-state-icon">⊘</div>No inquiries found.</div>
      ) : (
        inquiries.map((inquiry) => (
          <div className="ah-card" key={inquiry.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div className="ah-card-title">{inquiry.eventName}</div>
              {statusBadge(inquiry.status)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", marginBottom: 8 }}>
              <div className="ah-card-row">
                <span className="ah-card-label">Venue</span>
                <span className="ah-card-value">{inquiry.venue}</span>
              </div>
              <div className="ah-card-row">
                <span className="ah-card-label">Date</span>
                <span className="ah-card-value">{inquiry.eventDateTime}</span>
              </div>
            </div>

            {inquiry.organizerMessage && (
              <p style={{ fontSize: 12, color: "var(--ah-text-2)", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "var(--ah-radius-sm)", borderLeft: "2px solid var(--ah-accent-dim)", marginBottom: 8 }}>
                "{inquiry.organizerMessage}"
              </p>
            )}

            {inquiry.responseMessage && (
              <p style={{ fontSize: 12, color: "var(--ah-text-3)", marginBottom: 8 }}>
                <span style={{ color: "var(--ah-text-2)" }}>Your response: </span>
                {inquiry.responseMessage}
              </p>
            )}

            {inquiry.status === "PENDING" && (
              <div className="ah-card-actions">
                <button className="ah-btn ah-btn-success" onClick={() => respondToInquiry(inquiry.id, "INTERESTED")}>
                  ✓ Interested
                </button>
                <button className="ah-btn ah-btn-danger" onClick={() => respondToInquiry(inquiry.id, "NOT_INTERESTED")}>
                  ✕ Not Interested
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistInquiries;