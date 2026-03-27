import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  checkIncidentEscalation,
  getIncidentById,
  getIncidentEvidence,
  getIncidentLogs,
  uploadIncidentEvidence,
} from "../api/incidentApi";
import {
  createResolutionReport,
  getResolutionReportByIncidentId,
} from "../api/resolutionReportApi";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";

function IncidentDetailsPage() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [logs, setLogs] = useState([]);
  const [evidencePaths, setEvidencePaths] = useState([]);
  const [resolutionReport, setResolutionReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedBy, setUploadedBy] = useState("");
  const [uploading, setUploading] = useState(false);

  const [reportForm, setReportForm] = useState({
    summary: "",
    actionTaken: "",
    recommendations: "",
    preparedBy: "",
  });

  useEffect(() => {
    loadIncidentDetails();
  }, [id]);

  const loadIncidentDetails = async () => {
    try {
      setLoading(true);

      const [incidentData, logData, evidenceData] = await Promise.all([
        getIncidentById(id),
        getIncidentLogs(id),
        getIncidentEvidence(id),
      ]);

      setIncident(incidentData);
      setLogs(logData || []);
      setEvidencePaths(evidenceData || []);
      setErrorMessage("");

      try {
        const reportData = await getResolutionReportByIncidentId(id);
        setResolutionReport(reportData);
      } catch (error) {
        setResolutionReport(null);
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to load incident details."
      );
    } finally {
      setLoading(false);
    }
  };

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [logs]);

  const handleUploadEvidence = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please choose a file first.");
      return;
    }

    try {
      setUploading(true);
      const message = await uploadIncidentEvidence(id, selectedFile, uploadedBy);
      setSuccessMessage(message || "Evidence uploaded successfully.");
      setErrorMessage("");
      setSelectedFile(null);
      setUploadedBy("");
      await loadIncidentDetails();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to upload evidence."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCheckEscalation = async () => {
    try {
      const message = await checkIncidentEscalation(id);
      setSuccessMessage(message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to check escalation."
      );
    }
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateResolutionReport = async (e) => {
    e.preventDefault();

    if (!incident) return;

    if (incident.status !== "RESOLVED" && incident.status !== "CLOSED") {
      setErrorMessage("Resolution report can only be created for RESOLVED or CLOSED incidents.");
      return;
    }

    try {
      const created = await createResolutionReport(id, reportForm);
      setResolutionReport(created);
      setSuccessMessage("Resolution report created successfully.");
      setErrorMessage("");
      setReportForm({
        summary: "",
        actionTaken: "",
        recommendations: "",
        preparedBy: "",
      });
      await loadIncidentDetails();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to create resolution report."
      );
    }
  };

  const extractFileName = (filePath) => {
    if (!filePath) return "-";
    return filePath.split(/[/\\]/).pop();
  };

  if (loading) return <Loader />;

  if (!incident) {
    return <div className="error-box">Incident not found.</div>;
  }

  return (
    <div className="detail-page">
      <div className="page-header detail-header-row">
        <div>
          <h2>Incident Details</h2>
          <p>Review the full incident record, evidence, logs, and report.</p>
        </div>

        <Link to="/incidents" className="secondary-btn detail-back-btn">
          Back to Incident List
        </Link>
      </div>

      {successMessage && <div className="success-box">{successMessage}</div>}
      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Incident Summary</h3>

          <div className="detail-info-grid">
            <div className="detail-info-item">
              <span>ID</span>
              <strong>{incident.id}</strong>
            </div>

            <div className="detail-info-item">
              <span>Tracking Code</span>
              <strong>{incident.trackingCode || "-"}</strong>
            </div>

            <div className="detail-info-item">
              <span>Type</span>
              <strong>{incident.incidentType}</strong>
            </div>

            <div className="detail-info-item">
              <span>Priority</span>
              <strong>{incident.priority}</strong>
            </div>

            <div className="detail-info-item">
              <span>Status</span>
              <strong>
                <StatusBadge status={incident.status} />
              </strong>
            </div>

            <div className="detail-info-item">
              <span>Reported By</span>
              <strong>{incident.reportedBy}</strong>
            </div>

            <div className="detail-info-item">
              <span>Place</span>
              <strong>{incident.placeAreaName || "-"}</strong>
            </div>

            <div className="detail-info-item">
              <span>Exact Location</span>
              <strong>{incident.exactLocation || "-"}</strong>
            </div>

            <div className="detail-info-item">
              <span>Assigned Officer</span>
              <strong>{incident.assignedOfficerName || "Not Assigned"}</strong>
            </div>

            <div className="detail-info-item">
              <span>Reported Time</span>
              <strong>{incident.reportedTime || "-"}</strong>
            </div>
          </div>

          <div className="detail-description">
            <span>Description</span>
            <p>{incident.description}</p>
          </div>

          <div className="detail-actions-row">
            <button
              type="button"
              className="small-btn secondary-small-btn"
              onClick={handleCheckEscalation}
            >
              Check Escalation
            </button>
          </div>
        </div>

        <div className="detail-card">
          <h3>Evidence Upload</h3>

          <form onSubmit={handleUploadEvidence}>
            <div className="form-group">
              <label>Uploaded By</label>
              <input
                type="text"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                placeholder="Enter uploader name"
              />
            </div>

            <div className="form-group">
              <label>Select File</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Evidence"}
              </button>
            </div>
          </form>

          <div className="evidence-list">
            <h4>Uploaded Evidence</h4>

            {evidencePaths.length > 0 ? (
              evidencePaths.map((path, index) => (
                <div className="evidence-item" key={`${path}-${index}`}>
                  <strong>{extractFileName(path)}</strong>
                  <span>{path}</span>
                </div>
              ))
            ) : (
              <p className="empty-note">No evidence uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="detail-grid second-row-grid">
        <div className="detail-card">
          <h3>Incident Timeline</h3>

          {sortedLogs.length > 0 ? (
            <div className="timeline-list">
              {sortedLogs.map((log) => (
                <div className="timeline-item" key={log.id}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>{log.action}</strong>
                    <p>By: {log.actionBy}</p>
                    <span>{log.createdAt || "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-note">No incident logs found.</p>
          )}
        </div>

        <div className="detail-card">
          <h3>Resolution Report</h3>

          {resolutionReport ? (
            <div className="report-view">
              <div className="report-field">
                <span>Summary</span>
                <p>{resolutionReport.summary}</p>
              </div>

              <div className="report-field">
                <span>Action Taken</span>
                <p>{resolutionReport.actionTaken}</p>
              </div>

              <div className="report-field">
                <span>Recommendations</span>
                <p>{resolutionReport.recommendations || "-"}</p>
              </div>

              <div className="report-field">
                <span>Prepared By</span>
                <p>{resolutionReport.preparedBy}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="empty-note">
                No resolution report has been created yet.
              </p>

              <form onSubmit={handleCreateResolutionReport}>
                <div className="form-group">
                  <label>Summary</label>
                  <textarea
                    name="summary"
                    value={reportForm.summary}
                    onChange={handleReportChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Action Taken</label>
                  <textarea
                    name="actionTaken"
                    value={reportForm.actionTaken}
                    onChange={handleReportChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Recommendations</label>
                  <textarea
                    name="recommendations"
                    value={reportForm.recommendations}
                    onChange={handleReportChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Prepared By</label>
                  <input
                    type="text"
                    name="preparedBy"
                    value={reportForm.preparedBy}
                    onChange={handleReportChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    Create Resolution Report
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default IncidentDetailsPage;