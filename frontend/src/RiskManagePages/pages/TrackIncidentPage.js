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

<<<<<<< Updated upstream
  const handleTrack = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setIncident(null);
    const ve = validateTrackIncidentForm(trackingCode); setFieldErrors(ve);
    if (Object.keys(ve).length > 0) { setLoading(false); return; }
    try { setIncident(await trackIncident(trackingCode.trim().toUpperCase())); }
    catch (err) { setError(err.response?.data?.message || "Unable to track incident"); }
    finally { setLoading(false); }
=======
<<<<<<< Updated upstream
  const handleTrack = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setIncident(null);
    const ve = validateTrackIncidentForm(trackingCode); setFieldErrors(ve);
    if (Object.keys(ve).length > 0) { setLoading(false); return; }
    try { setIncident(await trackIncident(trackingCode.trim().toUpperCase())); }
    catch (err) { setError(err.response?.data?.message || "Unable to track incident"); }
    finally { setLoading(false); }
=======
  const validateTrackingCode = () => {
    const code = trackingCode.trim();
    if (!code) return "Tracking code is required";
    if (code.length < 6) return "Tracking code is too short";
    if (code.length > 40) return "Tracking code is too long";
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  };

  return (
    <div className="rm-scene-page">
      <div className="rm-scene-form-card rm-medium">
        <div className="rm-scene-heading">
          <h2>TRACK INCIDENT</h2>
          <p>Enter your tracking code to review progress.</p>
        </div>
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
        {error && <div className="rm-message-box rm-error">{error}</div>}
        <form onSubmit={handleTrack} className="rm-form-grid rm-one-column rm-compact-form">
          <div className="rm-form-group">
            <input value={trackingCode} onChange={e => { setTrackingCode(e.target.value); setFieldErrors({trackingCode:""}); }} placeholder="Tracking Code" className={fieldErrors.trackingCode ? "rm-input-error" : ""} />
            {fieldErrors.trackingCode && <small className="rm-field-error">{fieldErrors.trackingCode}</small>}
<<<<<<< Updated upstream
          </div>
          <button type="submit" className="rm-btn rm-btn-light rm-wide-btn" disabled={loading}>{loading ? "Checking..." : "TRACK"}</button>
        </form>
        {incident && (
=======
          </div>
          <button type="submit" className="rm-btn rm-btn-light rm-wide-btn" disabled={loading}>{loading ? "Checking..." : "TRACK"}</button>
=======

        {error && <div className="rm-message-box rm-error">{error}</div>}

        <form onSubmit={handleTrack} className="rm-form-grid rm-one-column rm-compact-form">
          <div className="rm-form-group">
            <input
              value={trackingCode}
              onChange={(e) => { setTrackingCode(e.target.value); setFieldError(""); }}
              placeholder="Tracking Code"
              className={fieldError ? "rm-input-error" : ""}
            />
            {fieldError && <small className="rm-field-error">{fieldError}</small>}
          </div>
          <button type="submit" className="rm-btn rm-btn-light rm-full-span" disabled={loading}>
            {loading ? "Checking..." : "TRACK"}
          </button>
>>>>>>> Stashed changes
        </form>
        {incident && (
<<<<<<< Updated upstream
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            </div>
          </div>
=======
            </div>
          </div>
=======
          <>
            <div className="track-result-card">
              <div className="track-row"><span>Code</span><strong>{incident.trackingCode}</strong></div>
              <div className="track-row"><span>Type</span><strong>{incident.incidentType}</strong></div>
              <div className="track-row"><span>Priority</span><strong>{incident.priority}</strong></div>
              <div className="track-row"><span>Status</span><StatusBadge value={incident.status} /></div>
              <div className="track-row"><span>Place</span><strong>{incident.placeAreaName}</strong></div>
              <div className="track-row"><span>Officer</span><strong>{incident.assignedOfficerName || "Pending Assignment"}</strong></div>
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
                subtitle={chatAvailable ? `Connected with ${incident.assignedOfficerName}` : "Chat opens after officer assignment"}
                disabled={!chatAvailable}
              />
            </div>
          </>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        )}
      </div>
    </div>
  );
};
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
>>>>>>> Stashed changes
export default TrackIncidentPage;
