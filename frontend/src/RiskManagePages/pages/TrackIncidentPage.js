import React, { useState } from "react";
import { trackIncident } from "../api/incidentApi";
import IncidentChatBox from "../components/common/IncidentChatBox";
import StatusBadge from "../components/common/StatusBadge";

const TrackIncidentPage = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [usedTrackingCode, setUsedTrackingCode] = useState("");
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateTrackingCode = () => {
    const code = trackingCode.trim();

    if (!code) {
      return "Tracking code is required";
    }

    if (code.length < 6) {
      return "Tracking code is too short";
    }

    if (code.length > 40) {
      return "Tracking code is too long";
    }

    return "";
  };

  const handleTrack = async (e) => {
    e.preventDefault();

    setError("");
    setIncident(null);

    const validationMessage = validateTrackingCode();
    setFieldError(validationMessage);

    if (validationMessage) return;

    setLoading(true);

    try {
      const cleanCode = trackingCode.trim().toUpperCase();
      const data = await trackIncident(cleanCode);
      setIncident(data);
      setUsedTrackingCode(cleanCode);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to track incident");
    } finally {
      setLoading(false);
    }
  };

  const chatAvailable = Boolean(incident?.assignedOfficerName);

  return (
    <div className="scene-page">
      <div className="scene-form-card medium">
        <div className="scene-heading">
          <h2>TRACK INCIDENT</h2>
          <p>Enter your tracking code to review progress.</p>
        </div>

        {error && <div className="message-box error">{error}</div>}

        <form onSubmit={handleTrack} className="form-grid one-column compact-form">
          <div className="form-group">
            <input
              value={trackingCode}
              onChange={(e) => {
                setTrackingCode(e.target.value);
                setFieldError("");
              }}
              placeholder="Tracking Code"
              className={fieldError ? "input-error" : ""}
            />
            {fieldError && <small className="field-error">{fieldError}</small>}
          </div>

          <button type="submit" className="btn btn-light wide-btn" disabled={loading}>
            {loading ? "Checking..." : "TRACK"}
          </button>
        </form>

        {incident && (
          <>
            <div className="track-result-card">
              <div className="track-row">
                <span>Code</span>
                <strong>{incident.trackingCode}</strong>
              </div>

              <div className="track-row">
                <span>Type</span>
                <strong>{incident.incidentType}</strong>
              </div>

              <div className="track-row">
                <span>Priority</span>
                <strong>{incident.priority}</strong>
              </div>

              <div className="track-row">
                <span>Status</span>
                <StatusBadge value={incident.status} />
              </div>

              <div className="track-row">
                <span>Place</span>
                <strong>{incident.placeAreaName}</strong>
              </div>

              <div className="track-row">
                <span>Officer</span>
                <strong>{incident.assignedOfficerName || "Pending Assignment"}</strong>
              </div>

              <div className="detail-description dark-panel">
                <strong>Description</strong>
                <p>{incident.description}</p>
              </div>
            </div>

            <div style={{ marginTop: "26px" }}>
              <IncidentChatBox
                mode="public"
                trackingCode={usedTrackingCode}
                senderName={incident.reportedBy || "Reporter"}
                title="Reporter Chat"
                subtitle={
                  chatAvailable
                    ? `Connected with ${incident.assignedOfficerName}`
                    : "Chat opens after officer assignment"
                }
                disabled={!chatAvailable}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackIncidentPage;