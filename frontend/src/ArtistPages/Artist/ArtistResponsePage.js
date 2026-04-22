import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inquiryService from "../../services/inquiryService";
import invitationService from "../../services/invitationService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

/*
  ArtistResponsePage
  ------------------
  Allows an artist to respond to a specific inquiry OR invitation by ID
  from a direct link (e.g. email link). The `type` param distinguishes them.

  Route examples:
    /artist/respond/inquiry/:id
    /artist/respond/invitation/:id
*/

function ArtistResponsePage() {
  const { id, type } = useParams();        // type = "inquiry" | "invitation"
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isInquiry = type === "inquiry";

  useEffect(() => {
    if (!id || !type) { setError("Invalid response link."); setLoading(false); return; }
    const fetch = isInquiry
      ? inquiryService.getInquiryById(id)
      : invitationService.getInvitationById(id);

    fetch
      .then((res) => setItem(res.data))
      .catch(() => setError("Could not load the request. It may have expired or already been responded to."))
      .finally(() => setLoading(false));
  }, [id, type]);

  const handleRespond = async (status) => {
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      if (isInquiry) {
        await inquiryService.respondToInquiry(id, {
          status,
          responseMessage:
            status === "INTERESTED"
              ? "Yes, I am interested in this event."
              : "Sorry, I am not available for this event.",
        });
      } else {
        await invitationService.respondToInvitation(id, {
          status,
          declineReason: status === "DECLINED" ? "I am unavailable on this date." : "",
        });
      }
      setMessage("Your response has been recorded successfully.");
      setTimeout(() => navigate("/artist/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const positiveStatus  = isInquiry ? "INTERESTED" : "ACCEPTED";
  const negativeStatus  = isInquiry ? "NOT_INTERESTED" : "DECLINED";
  const positiveLabel   = isInquiry ? "I'm Interested" : "Accept Invitation";
  const negativeLabel   = isInquiry ? "Not Interested" : "Decline Invitation";

  return (
    <ArtistModuleLayout
      title={isInquiry ? "Respond to Inquiry" : "Respond to Invitation"}
      subtitle={isInquiry
        ? "Let the organizer know if you're available."
        : "Accept or decline this performance invitation."}
    >
      {loading ? (
        <div className="ah-state"><div className="ah-state-icon">◌</div>Loading request…</div>
      ) : error && !item ? (
        <div className="ah-error">{error}</div>
      ) : item ? (
        <div style={{ maxWidth: 520 }}>
          {/* Request details card */}
          <div className="ah-card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div className="ah-card-title">{item.eventName}</div>
              <span className={`ah-badge ah-badge-${item.status?.toLowerCase()}`}>{item.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", marginBottom: 10 }}>
              <div className="ah-card-row">
                <span className="ah-card-label">Venue</span>
                <span className="ah-card-value">{item.venue}</span>
              </div>
              <div className="ah-card-row">
                <span className="ah-card-label">Date &amp; Time</span>
                <span className="ah-card-value">{item.eventDateTime}</span>
              </div>
            </div>

            {item.organizerMessage && (
              <p style={{
                fontSize: 13, color: "var(--ah-text-2)",
                background: "rgba(255,255,255,0.03)", padding: "10px 14px",
                borderRadius: "var(--ah-radius-sm)", borderLeft: "2px solid var(--ah-accent)",
                lineHeight: 1.6
              }}>
                "{item.organizerMessage}"
              </p>
            )}
          </div>

          {/* Already responded */}
          {item.status !== "PENDING" ? (
            <div style={{
              background: "var(--ah-card)", border: "1px solid var(--ah-border)",
              borderRadius: "var(--ah-radius-lg)", padding: "28px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>
                {item.status === "INTERESTED" || item.status === "ACCEPTED" ? "✓" : "✕"}
              </div>
              <p style={{ fontSize: 14, color: "var(--ah-text-1)", fontWeight: 500, marginBottom: 6 }}>
                You already responded to this request.
              </p>
              <p style={{ fontSize: 13, color: "var(--ah-text-3)" }}>
                Status: <span className={`ah-badge ah-badge-${item.status?.toLowerCase()}`}>{item.status}</span>
              </p>
            </div>
          ) : (
            /* Response actions */
            <div style={{
              background: "var(--ah-card)", border: "1px solid var(--ah-border)",
              borderRadius: "var(--ah-radius-lg)", padding: "24px"
            }}>
              <p style={{ fontSize: 13, color: "var(--ah-text-2)", marginBottom: 20 }}>
                Please confirm your availability for this event. Your response will be sent to the organizer immediately.
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="ah-btn ah-btn-success"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                  onClick={() => handleRespond(positiveStatus)}
                  disabled={submitting}
                >
                  ✓ {positiveLabel}
                </button>
                <button
                  className="ah-btn ah-btn-danger"
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                  onClick={() => handleRespond(negativeStatus)}
                  disabled={submitting}
                >
                  ✕ {negativeLabel}
                </button>
              </div>

              {error  && <p className="artist-form-message error"   style={{ marginTop: 14 }}>{error}</p>}
              {message && <p className="artist-form-message success" style={{ marginTop: 14 }}>{message}</p>}
            </div>
          )}
        </div>
      ) : null}
    </ArtistModuleLayout>
  );
}

export default ArtistResponsePage;