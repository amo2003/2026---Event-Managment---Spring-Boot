import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIncidentById, getIncidentTimeline, updateIncidentStatus, uploadEvidence } from "../api/incidentApi";
import { createResolutionReport, getResolutionReportByIncidentId } from "../api/resolutionReportApi";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { validateEvidenceFile, validateResolutionReportForm } from "../utils/validation";

const IncidentDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceError, setEvidenceError] = useState("");
  const [reportErrors, setReportErrors] = useState({});
  const [reportForm, setReportForm] = useState({ summary:"", actionTaken:"", preparedBy: user?.fullName||"" });

  const loadData = async () => {
    try {
      setIncident(await getIncidentById(id));
      setTimeline(await getIncidentTimeline(id));
      try { setReport(await getResolutionReportByIncidentId(id)); } catch { setReport(null); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]); // eslint-disable-line

  const handleStatus = async (status) => {
    let resolutionSummary = "";
    if (status === "RESOLVED") { resolutionSummary = window.prompt("Enter resolution summary:"); if (!resolutionSummary) return; }
    await updateIncidentStatus(id, { status, actionBy: user?.fullName||"Officer", resolutionSummary });
    await loadData();
  };

  const handleEvidenceUpload = async (e) => {
    e.preventDefault();
    const ve = validateEvidenceFile(evidenceFile);
    if (ve.file) { setEvidenceError(ve.file); return; }
    setEvidenceError("");
    await uploadEvidence(id, evidenceFile, user?.fullName||"Officer");
    setEvidenceFile(null); alert("Evidence uploaded successfully"); await loadData();
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const ve = validateResolutionReportForm(reportForm); setReportErrors(ve);
    if (Object.keys(ve).length > 0) return;
    setReport(await createResolutionReport(id, reportForm));
    await loadData();
  };

  if (loading) return <Loader />;

  return (
    <div className="rm-detail-page-grid">
      <div className="rm-page-card">
        <div className="rm-section-head"><h2>Incident Details</h2><p>Complete workflow view of the selected incident.</p></div>
        <div className="rm-detail-grid">
          <div><strong>ID:</strong> {incident.id}</div>
          <div><strong>Tracking Code:</strong> {incident.trackingCode}</div>
          <div><strong>Type:</strong> {incident.incidentType}</div>
          <div><strong>Priority:</strong> {incident.priority}</div>
          <div><strong>Status:</strong> <StatusBadge value={incident.status} /></div>
          <div><strong>Place:</strong> {incident.placeAreaName}</div>
          <div><strong>Location:</strong> {incident.exactLocation}</div>
          <div><strong>Reported By:</strong> {incident.reportedBy}</div>
          <div><strong>Assigned Officer:</strong> {incident.assignedOfficerName || "Pending"}</div>
        </div>
        <div className="rm-detail-description"><strong>Description</strong><p>{incident.description}</p></div>
        <div className="rm-button-row">
          <button className="rm-btn rm-btn-secondary" onClick={() => handleStatus("IN_ACTION")}>Mark In Action</button>
          <button className="rm-btn rm-btn-primary" onClick={() => handleStatus("RESOLVED")}>Mark Resolved</button>
        </div>
      </div>

      <div className="rm-page-card">
        <div className="rm-section-head"><h3>Evidence Upload</h3></div>
        <form onSubmit={handleEvidenceUpload} className="rm-form-grid rm-one-column">
          <div className="rm-form-group">
            <label>Select Evidence File</label>
            <input type="file" onChange={e => { setEvidenceFile(e.target.files?.[0]||null); setEvidenceError(""); }} className={evidenceError ? "rm-input-error" : ""} />
            {evidenceError && <small className="rm-field-error">{evidenceError}</small>}
          </div>
          <button type="submit" className="rm-btn rm-btn-primary">Upload Evidence</button>
        </form>
      </div>

      <div className="rm-page-card">
        <div className="rm-section-head"><h3>Timeline</h3></div>
        {timeline.length === 0 ? <p className="rm-empty-text">No timeline records available.</p>
          : <div className="rm-timeline-list">
              {timeline.map(item => (
                <div key={item.id} className="rm-timeline-item">
                  <strong>{item.action}</strong>
                  <p>By: {item.actionBy}</p>
                  <span>{item.createdAt}</span>
                </div>
              ))}
            </div>}
      </div>

      <div className="rm-page-card">
        <div className="rm-section-head"><h3>Resolution Report</h3></div>
        {report ? (
          <div className="rm-report-view">
            <div><strong>Summary:</strong> {report.summary}</div>
            <div><strong>Action Taken:</strong> {report.actionTaken}</div>
            <div><strong>Prepared By:</strong> {report.preparedBy}</div>
            <div><strong>Created At:</strong> {report.createdAt}</div>
          </div>
        ) : (
          <form onSubmit={handleCreateReport} className="rm-form-grid rm-one-column">
            {[["summary","Summary"],["actionTaken","Action Taken"]].map(([k,l]) => (
              <div key={k} className="rm-form-group">
                <label>{l}</label>
                <textarea value={reportForm[k]} onChange={e => { setReportForm({...reportForm,[k]:e.target.value}); setReportErrors({...reportErrors,[k]:""}); }} rows="3" className={reportErrors[k] ? "rm-input-error" : ""} />
                {reportErrors[k] && <small className="rm-field-error">{reportErrors[k]}</small>}
              </div>
            ))}
            <div className="rm-form-group">
              <label>Prepared By</label>
              <input value={reportForm.preparedBy} onChange={e => { setReportForm({...reportForm,preparedBy:e.target.value}); setReportErrors({...reportErrors,preparedBy:""}); }} className={reportErrors.preparedBy ? "rm-input-error" : ""} />
              {reportErrors.preparedBy && <small className="rm-field-error">{reportErrors.preparedBy}</small>}
            </div>
            <button type="submit" className="rm-btn rm-btn-primary">Create Resolution Report</button>
          </form>
        )}
      </div>
    </div>
  );
};
export default IncidentDetailsPage;
