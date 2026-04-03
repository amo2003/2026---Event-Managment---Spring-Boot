/* ---- InquiryResponses.js ---- */
import React, { useState } from "react";
import inquiryService from "../../services/inquiryService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

export function InquiryResponses() {
  const [eventId, setEventId] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponses = async () => {
    setError(""); setLoading(true);
    try {
      const response = await inquiryService.getInquiriesByEvent(eventId);
      setInquiries(response.data);
    } catch (err) {
      setError("Failed to fetch inquiry responses");
      setInquiries([]);
    } finally { setLoading(false); }
  };

  return (
    <ArtistModuleLayout title="Inquiry Responses" subtitle="View artist responses to event inquiries.">
      <div className="ah-inline-form">
        <input type="number" placeholder="Enter Event ID" value={eventId}
          onChange={(e) => setEventId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchResponses()} />
        <button className="ah-search-btn" onClick={fetchResponses}>View Responses</button>
      </div>
      {error && <div className="ah-error">{error}</div>}
      {loading ? (
        <div className="ah-state"><div className="ah-state-icon">◌</div>Loading…</div>
      ) : inquiries.length === 0 ? (
        <div className="ah-state"><div className="ah-state-icon">⊘</div>No inquiry responses found.</div>
      ) : inquiries.map((inquiry) => (
        <div className="ah-card" key={inquiry.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div className="ah-card-title">{inquiry.artistName}</div>
            <span className={`ah-badge ah-badge-${inquiry.status?.toLowerCase()}`}>{inquiry.status}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
            <div className="ah-card-row"><span className="ah-card-label">Event</span><span className="ah-card-value">{inquiry.eventName}</span></div>
            <div className="ah-card-row"><span className="ah-card-label">Venue</span><span className="ah-card-value">{inquiry.venue}</span></div>
            <div className="ah-card-row"><span className="ah-card-label">Date</span><span className="ah-card-value">{inquiry.eventDateTime}</span></div>
          </div>
          {inquiry.responseMessage && (
            <p style={{ fontSize: 12, color: "var(--ah-text-2)", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--ah-border)" }}>
              {inquiry.responseMessage}
            </p>
          )}
        </div>
      ))}
    </ArtistModuleLayout>
  );
}

export default InquiryResponses;