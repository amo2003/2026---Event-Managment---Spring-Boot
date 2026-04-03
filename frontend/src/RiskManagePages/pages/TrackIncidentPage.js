import React, { useState } from "react";
import { trackIncident } from "../api/incidentApi";
import StatusBadge from "../components/common/StatusBadge";
import { validateTrackIncidentForm } from "../utils/validation";

const TrackIncidentPage = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIncident(null);

    const validationErrors = validateTrackIncidentForm(trackingCode);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const data = await trackIncident(trackingCode.trim().toUpperCase());
      setIncident(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to track incident");
    } finally {
      setLoading(false);
    }
  };

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
                setFieldErrors({ trackingCode: "" });
              }}
              placeholder="Tracking Code"
              className={fieldErrors.trackingCode ? "input-error" : ""}
            />
            {fieldErrors.trackingCode && (
              <small className="field-error">{fieldErrors.trackingCode}</small>
            )}
          </div>

          <button type="submit" className="btn btn-light wide-btn" disabled={loading}>
            {loading ? "Checking..." : "TRACK"}
          </button>
        </form>

        {incident && (
          <div className="track-result-card">
            <div className="track-row"><span>Code</span><strong>{incident.trackingCode}</strong></div>
            <div className="track-row"><span>Type</span><strong>{incident.incidentType}</strong></div>
            <div className="track-row"><span>Priority</span><strong>{incident.priority}</strong></div>
            <div className="track-row"><span>Status</span><StatusBadge value={incident.status} /></div>
            <div className="track-row"><span>Place</span><strong>{incident.placeAreaName}</strong></div>
            <div className="track-row"><span>Officer</span><strong>{incident.assignedOfficerName || "Pending"}</strong></div>

            <div className="detail-description dark-panel">
              <strong>Description</strong>
              <p>{incident.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackIncidentPage;