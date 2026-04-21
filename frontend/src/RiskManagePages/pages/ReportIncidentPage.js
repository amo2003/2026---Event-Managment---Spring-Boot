import React, { useEffect, useState } from "react";
import { createIncident, uploadEvidence } from "../api/incidentApi";
import { getPlaceAreas } from "../api/placeAreaApi";
import Loader from "../components/common/Loader";
import { validateReportIncidentForm } from "../utils/validation";

const initialForm = {
  incidentType: "",
  priority: "",
  description: "",
  reportedBy: "",
  placeAreaId: "",
  exactLocation: "",
};

const ReportIncidentPage = () => {
  const [form, setForm] = useState(initialForm);
  const [placeAreas, setPlaceAreas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [createdIncident, setCreatedIncident] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await getPlaceAreas();
        setPlaceAreas(data);
      } catch {
        setError("Failed to load place areas");
      } finally {
        setPlacesLoading(false);
      }
    };

    loadPlaces();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setErrors({ ...errors, file: "" });
  };

  const handleCopyTrackingCode = async () => {
    const code = createdIncident?.trackingCode;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setCreatedIncident(null);
    setCopied(false);

    const validationErrors = validateReportIncidentForm(form, selectedFile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        priority: form.priority || null,
        placeAreaId: Number(form.placeAreaId),
      };

      const incident = await createIncident(payload);

      let uploadWarning = "";

      if (selectedFile && incident?.id) {
        try {
          await uploadEvidence(incident.id, selectedFile, form.reportedBy);
        } catch {
          uploadWarning = "Incident submitted, but evidence upload failed.";
        }
      }

      setCreatedIncident({
        ...incident,
        uploadWarning,
      });

      setForm(initialForm);
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit incident");
    } finally {
      setLoading(false);
    }
  };

  if (placesLoading) return <Loader />;

  return (
    <div className="scene-page">
      <div className="scene-form-card">
        <div className="scene-heading">
          <h2>REPORT INCIDENT</h2>
          <p>Submit an incident for immediate recording and response.</p>
        </div>

        {error && <div className="message-box error">{error}</div>}

        {createdIncident && (
          <div className="message-box success">
            <strong>Incident submitted successfully.</strong>

            <div className="tracking-code-copy-row">
              <span>
                Tracking Code: <strong>{createdIncident.trackingCode}</strong>
              </span>

              <button
                type="button"
                className={`copy-code-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyTrackingCode}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div>
              Status: <strong>{createdIncident.status}</strong>
            </div>

            {createdIncident.uploadWarning && (
              <div className="upload-warning-text">
                {createdIncident.uploadWarning}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid compact-form">
          <div className="form-group">
            <label>Incident Type</label>
            <select
              name="incidentType"
              value={form.incidentType}
              onChange={handleChange}
              className={errors.incidentType ? "input-error" : ""}
            >
              <option value="">Select incident type</option>
              <option value="FIGHT">Fight</option>
              <option value="MEDICAL">Medical</option>
              <option value="FIRE">Fire</option>
              <option value="SECURITY">Security</option>
              <option value="CROWD_CONTROL">Crowd Control</option>
              <option value="TECHNICAL">Technical</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.incidentType && (
              <small className="field-error">{errors.incidentType}</small>
            )}
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={errors.priority ? "input-error" : ""}
            >
              <option value="">Auto suggest</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            {errors.priority && (
              <small className="field-error">{errors.priority}</small>
            )}
          </div>

          <div className="form-group">
            <label>Reported By</label>
            <input
              name="reportedBy"
              value={form.reportedBy}
              onChange={handleChange}
              placeholder="Reporter Name"
              className={errors.reportedBy ? "input-error" : ""}
            />
            {errors.reportedBy && (
              <small className="field-error">{errors.reportedBy}</small>
            )}
          </div>

          <div className="form-group">
            <label>Place Area</label>
            <select
              name="placeAreaId"
              value={form.placeAreaId}
              onChange={handleChange}
              className={errors.placeAreaId ? "input-error" : ""}
            >
              <option value="">Select place area</option>
              {placeAreas.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
            {errors.placeAreaId && (
              <small className="field-error">{errors.placeAreaId}</small>
            )}
          </div>

          <div className="form-group full-span">
            <label>Exact Location</label>
            <input
              name="exactLocation"
              value={form.exactLocation}
              onChange={handleChange}
              placeholder="Exact Location"
              className={errors.exactLocation ? "input-error" : ""}
            />
            {errors.exactLocation && (
              <small className="field-error">{errors.exactLocation}</small>
            )}
          </div>

          <div className="form-group full-span">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the incident"
              rows="5"
              className={errors.description ? "input-error" : ""}
            />
            {errors.description && (
              <small className="field-error">{errors.description}</small>
            )}
          </div>

          <div className="form-group full-span">
            <label>Evidence Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={errors.file ? "input-error" : ""}
            />
            {errors.file && <small className="field-error">{errors.file}</small>}
          </div>

          <button type="submit" className="btn btn-light wide-btn" disabled={loading}>
            {loading ? "Submitting..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIncidentPage;