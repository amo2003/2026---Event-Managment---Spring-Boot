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
    e.preventDefault(); setLoading(true); setError(""); setIncident(null);
    const ve = validateTrackIncidentForm(trackingCode); setFieldErrors(ve);
    if (Object.keys(ve).length > 0) { setLoading(false); return; }
    try { setIncident(await trackIncident(trackingCode.trim().toUpperCase())); }
    catch (err) { setError(err.response?.data?.message || "Unable to track incident"); }
    finally { setLoading(false); }
  };

  return (
    <div className="rm-scene-page">
      <div className="rm-scene-form-card rm-medium">
        <div className="rm-scene-heading">
          <h2>TRACK INCIDENT</h2>
          <p>Enter your tracking code to review progress.</p>
        </div>
        {error && <div className="rm-message-box rm-error">{error}</div>}
        <form onSubmit={handleTrack} className="rm-form-grid rm-one-column rm-compact-form">
          <div className="rm-form-group">
            <input value={trackingCode} onChange={e => { setTrackingCode(e.target.value); setFieldErrors({trackingCode:""}); }} placeholder="Tracking Code" className={fieldErrors.trackingCode ? "rm-input-error" : ""} />
            {fieldErrors.trackingCode && <small className="rm-field-error">{fieldErrors.trackingCode}</small>}
          </div>
          <button type="submit" className="rm-btn rm-btn-light rm-wide-btn" disabled={loading}>{loading ? "Checking..." : "TRACK"}</button>
        </form>
        {incident && (
          <div className="rm-track-result-card">
            <div className="rm-track-row"><span>Code</span><strong>{incident.trackingCode}</strong></div>
            <div className="rm-track-row"><span>Type</span><strong>{incident.incidentType}</strong></div>
            <div className="rm-track-row"><span>Priority</span><strong>{incident.priority}</strong></div>
            <div className="rm-track-row"><span>Status</span><StatusBadge value={incident.status} /></div>
            <div className="rm-track-row"><span>Place</span><strong>{incident.placeAreaName}</strong></div>
            <div className="rm-track-row"><span>Officer</span><strong>{incident.assignedOfficerName || "Pending"}</strong></div>
            <div className="rm-detail-description rm-dark-panel">
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
