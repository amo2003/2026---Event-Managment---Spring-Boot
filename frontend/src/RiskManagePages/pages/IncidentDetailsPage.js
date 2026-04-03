import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getIncidentById,
  getIncidentTimeline,
  updateIncidentStatus,
  uploadEvidence,
} from "../api/incidentApi";
import {
  createResolutionReport,
  getResolutionReportByIncidentId,
} from "../api/resolutionReportApi";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import {
  validateEvidenceFile,
  validateResolutionReportForm,
} from "../utils/validation";

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
  const [reportForm, setReportForm] = useState({
    summary: "",
    actionTaken: "",
    preparedBy: user?.fullName || "",
  });

  const loadData = async () => {
    try {
      const incidentData = await getIncidentById(id);
      setIncident(incidentData);

      const timelineData = await getIncidentTimeline(id);
      setTimeline(timelineData);

      try {
        const reportData = await getResolutionReportByIncidentId(id);
        setReport(reportData);
      } catch {
        setReport(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatus = async (status) => {
    let resolutionSummary = "";

    if (status === "RESOLVED") {
      resolutionSummary = window.prompt("Enter resolution summary:");
      if (!resolutionSummary) return;
    }

    await updateIncidentStatus(id, {
      status,
      actionBy: user?.fullName || "Officer",
      resolutionSummary,
    });

    await loadData();
  };

  const handleEvidenceUpload = async (e) => {
    e.preventDefault();

    const validationErrors = validateEvidenceFile(evidenceFile);
    if (validationErrors.file) {
      setEvidenceError(validationErrors.file);
      return;
    }

    setEvidenceError("");
    await uploadEvidence(id, evidenceFile, user?.fullName || "Officer");
    setEvidenceFile(null);
    alert("Evidence uploaded successfully");
    await loadData();
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();

    const validationErrors = validateResolutionReportForm(reportForm);
    setReportErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const created = await createResolutionReport(id, reportForm);
    setReport(created);
    await loadData();
  };

  if (loading) return <Loader />;

  return (
    <div className="detail-page-grid">
      <div className="page-card">
        <div className="section-head">
          <h2>Incident Details</h2>
          <p>Complete workflow view of the selected incident.</p>
        </div>

        <div className="detail-grid">
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

        <div className="detail-description">
          <strong>Description</strong>
          <p>{incident.description}</p>
        </div>

        <div className="button-row">
          <button className="btn btn-secondary" onClick={() => handleStatus("IN_ACTION")}>
            Mark In Action
          </button>
          <button className="btn btn-primary" onClick={() => handleStatus("RESOLVED")}>
            Mark Resolved
          </button>
        </div>
      </div>

      <div className="page-card">
        <div className="section-head">
          <h3>Evidence Upload</h3>
        </div>

        <form onSubmit={handleEvidenceUpload} className="form-grid one-column">
          <div className="form-group">
            <label>Select Evidence File</label>
            <input
              type="file"
              onChange={(e) => {
                setEvidenceFile(e.target.files?.[0] || null);
                setEvidenceError("");
              }}
              className={evidenceError ? "input-error" : ""}
            />
            {evidenceError && <small className="field-error">{evidenceError}</small>}
          </div>
          <button type="submit" className="btn btn-primary">
            Upload Evidence
          </button>
        </form>
      </div>

      <div className="page-card">
        <div className="section-head">
          <h3>Timeline</h3>
        </div>

        {timeline.length === 0 ? (
          <p className="empty-text">No timeline records available.</p>
        ) : (
          <div className="timeline-list">
            {timeline.map((item) => (
              <div key={item.id} className="timeline-item">
                <strong>{item.action}</strong>
                <p>By: {item.actionBy}</p>
                <span>{item.createdAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="page-card">
        <div className="section-head">
          <h3>Resolution Report</h3>
        </div>

        {report ? (
          <div className="report-view">
            <div><strong>Summary:</strong> {report.summary}</div>
            <div><strong>Action Taken:</strong> {report.actionTaken}</div>
            <div><strong>Prepared By:</strong> {report.preparedBy}</div>
            <div><strong>Created At:</strong> {report.createdAt}</div>
          </div>
        ) : (
          <form onSubmit={handleCreateReport} className="form-grid one-column">
            <div className="form-group">
              <label>Summary</label>
              <textarea
                value={reportForm.summary}
                onChange={(e) => {
                  setReportForm({ ...reportForm, summary: e.target.value });
                  setReportErrors({ ...reportErrors, summary: "" });
                }}
                rows="3"
                className={reportErrors.summary ? "input-error" : ""}
              />
              {reportErrors.summary && <small className="field-error">{reportErrors.summary}</small>}
            </div>

            <div className="form-group">
              <label>Action Taken</label>
              <textarea
                value={reportForm.actionTaken}
                onChange={(e) => {
                  setReportForm({ ...reportForm, actionTaken: e.target.value });
                  setReportErrors({ ...reportErrors, actionTaken: "" });
                }}
                rows="3"
                className={reportErrors.actionTaken ? "input-error" : ""}
              />
              {reportErrors.actionTaken && (
                <small className="field-error">{reportErrors.actionTaken}</small>
              )}
            </div>

            <div className="form-group">
              <label>Prepared By</label>
              <input
                value={reportForm.preparedBy}
                onChange={(e) => {
                  setReportForm({ ...reportForm, preparedBy: e.target.value });
                  setReportErrors({ ...reportErrors, preparedBy: "" });
                }}
                className={reportErrors.preparedBy ? "input-error" : ""}
              />
              {reportErrors.preparedBy && (
                <small className="field-error">{reportErrors.preparedBy}</small>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Create Resolution Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default IncidentDetailsPage;