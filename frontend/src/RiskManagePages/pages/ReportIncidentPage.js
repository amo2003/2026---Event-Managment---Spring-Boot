import React, { useEffect, useState } from "react";
import { createIncident, uploadEvidence } from "../api/incidentApi";
import { getPlaceAreas } from "../api/placeAreaApi";
import Loader from "../components/common/Loader";
import { validateReportIncidentForm } from "../utils/validation";

const initialForm = { incidentType:"", priority:"", description:"", reportedBy:"", placeAreaId:"", exactLocation:"" };

const ReportIncidentPage = () => {
  const [form, setForm] = useState(initialForm);
  const [placeAreas, setPlaceAreas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [createdIncident, setCreatedIncident] = useState(null);

  useEffect(() => {
    getPlaceAreas().then(setPlaceAreas).catch(() => setError("Failed to load place areas")).finally(() => setPlacesLoading(false));
  }, []);

  const handleChange = (e) => { setForm({...form,[e.target.name]:e.target.value}); setErrors({...errors,[e.target.name]:""}); };
  const handleFileChange = (e) => { setSelectedFile(e.target.files?.[0]||null); setErrors({...errors,file:""}); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setCreatedIncident(null);
    const ve = validateReportIncidentForm(form, selectedFile); setErrors(ve);
    if (Object.keys(ve).length > 0) { setLoading(false); return; }
    try {
      const incident = await createIncident({...form, priority:form.priority||null, placeAreaId:Number(form.placeAreaId)});
      let uploadWarning = "";
      if (selectedFile && incident?.id) {
        try { await uploadEvidence(incident.id, selectedFile, form.reportedBy); }
        catch { uploadWarning = "Incident submitted, but evidence upload failed."; }
      }
      setCreatedIncident({...incident, uploadWarning});
      setForm(initialForm); setSelectedFile(null); setErrors({});
    } catch (err) { setError(err.response?.data?.message || "Failed to submit incident"); }
    finally { setLoading(false); }
  };

  if (placesLoading) return <Loader />;

  return (
    <div className="rm-scene-page">
      <div className="rm-scene-form-card">
        <div className="rm-scene-heading">
          <h2>REPORT INCIDENT</h2>
          <p>Submit an incident for immediate recording and response.</p>
        </div>
<<<<<<< Updated upstream
        {error && <div className="rm-message-box rm-error">{error}</div>}
        {createdIncident && (
          <div className="rm-message-box rm-success">
            <strong>Incident submitted successfully.</strong><br />
            Tracking Code: <strong>{createdIncident.trackingCode}</strong><br />
            Status: <strong>{createdIncident.status}</strong>
            {createdIncident.uploadWarning && <><br /><span>{createdIncident.uploadWarning}</span></>}
          </div>
        )}
        <form onSubmit={handleSubmit} className="rm-form-grid rm-compact-form">
          <div className="rm-form-group">
            <label>Incident Type</label>
            <select name="incidentType" value={form.incidentType} onChange={handleChange} className={errors.incidentType ? "rm-input-error" : ""}>
              <option value="">Select incident type</option>
              {["FIGHT","MEDICAL","FIRE","SECURITY","CROWD_CONTROL","TECHNICAL","OTHER"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.incidentType && <small className="rm-field-error">{errors.incidentType}</small>}
          </div>
          <div className="rm-form-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="">Auto suggest</option>
              {["LOW","MEDIUM","HIGH","CRITICAL"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="rm-form-group">
            <label>Reported By</label>
            <input name="reportedBy" value={form.reportedBy} onChange={handleChange} placeholder="Reporter Name" className={errors.reportedBy ? "rm-input-error" : ""} />
            {errors.reportedBy && <small className="rm-field-error">{errors.reportedBy}</small>}
          </div>
          <div className="rm-form-group">
            <label>Place Area</label>
            <select name="placeAreaId" value={form.placeAreaId} onChange={handleChange} className={errors.placeAreaId ? "rm-input-error" : ""}>
              <option value="">Select place area</option>
              {placeAreas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.placeAreaId && <small className="rm-field-error">{errors.placeAreaId}</small>}
          </div>
          <div className="rm-form-group rm-full-span">
            <label>Exact Location</label>
            <input name="exactLocation" value={form.exactLocation} onChange={handleChange} placeholder="Exact Location" className={errors.exactLocation ? "rm-input-error" : ""} />
            {errors.exactLocation && <small className="rm-field-error">{errors.exactLocation}</small>}
          </div>
          <div className="rm-form-group rm-full-span">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the incident" rows="5" className={errors.description ? "rm-input-error" : ""} />
            {errors.description && <small className="rm-field-error">{errors.description}</small>}
          </div>
          <div className="rm-form-group rm-full-span">
            <label>Evidence Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className={errors.file ? "rm-input-error" : ""} />
            {errors.file && <small className="rm-field-error">{errors.file}</small>}
          </div>
          <button type="submit" className="rm-btn rm-btn-light rm-wide-btn rm-full-span" disabled={loading}>{loading ? "Submitting..." : "SUBMIT"}</button>
=======
<<<<<<< Updated upstream
        {error && <div className="rm-message-box rm-error">{error}</div>}
        {createdIncident && (
          <div className="rm-message-box rm-success">
            <strong>Incident submitted successfully.</strong><br />
            Tracking Code: <strong>{createdIncident.trackingCode}</strong><br />
            Status: <strong>{createdIncident.status}</strong>
            {createdIncident.uploadWarning && <><br /><span>{createdIncident.uploadWarning}</span></>}
          </div>
        )}
        <form onSubmit={handleSubmit} className="rm-form-grid rm-compact-form">
          <div className="rm-form-group">
            <label>Incident Type</label>
            <select name="incidentType" value={form.incidentType} onChange={handleChange} className={errors.incidentType ? "rm-input-error" : ""}>
=======

        {error && <div className="rm-message-box rm-error">{error}</div>}

        {createdIncident && (
          <div className="rm-message-box rm-success">
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

        <form onSubmit={handleSubmit} className="rm-form-grid rm-compact-form">
          <div className="rm-form-group">
            <label>Incident Type</label>
            <select
              name="incidentType"
              value={form.incidentType}
              onChange={handleChange}
              className={errors.incidentType ? "rm-input-error" : ""}
            >
>>>>>>> Stashed changes
              <option value="">Select incident type</option>
              {["FIGHT","MEDICAL","FIRE","SECURITY","CROWD_CONTROL","TECHNICAL","OTHER"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
<<<<<<< Updated upstream
            {errors.incidentType && <small className="rm-field-error">{errors.incidentType}</small>}
          </div>
          <div className="rm-form-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
=======
            {errors.incidentType && (
              <small className="rm-field-error">{errors.incidentType}</small>
            )}
          </div>

          <div className="rm-form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={errors.priority ? "rm-input-error" : ""}
            >
>>>>>>> Stashed changes
              <option value="">Auto suggest</option>
              {["LOW","MEDIUM","HIGH","CRITICAL"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
<<<<<<< Updated upstream
          </div>
          <div className="rm-form-group">
            <label>Reported By</label>
            <input name="reportedBy" value={form.reportedBy} onChange={handleChange} placeholder="Reporter Name" className={errors.reportedBy ? "rm-input-error" : ""} />
            {errors.reportedBy && <small className="rm-field-error">{errors.reportedBy}</small>}
          </div>
          <div className="rm-form-group">
            <label>Place Area</label>
            <select name="placeAreaId" value={form.placeAreaId} onChange={handleChange} className={errors.placeAreaId ? "rm-input-error" : ""}>
=======
            {errors.priority && (
              <small className="rm-field-error">{errors.priority}</small>
            )}
          </div>

          <div className="rm-form-group">
            <label>Reported By</label>
            <input
              name="reportedBy"
              value={form.reportedBy}
              onChange={handleChange}
              placeholder="Reporter Name"
              className={errors.reportedBy ? "rm-input-error" : ""}
            />
            {errors.reportedBy && (
              <small className="rm-field-error">{errors.reportedBy}</small>
            )}
          </div>

          <div className="rm-form-group">
            <label>Place Area</label>
            <select
              name="placeAreaId"
              value={form.placeAreaId}
              onChange={handleChange}
              className={errors.placeAreaId ? "rm-input-error" : ""}
            >
>>>>>>> Stashed changes
              <option value="">Select place area</option>
              {placeAreas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
<<<<<<< Updated upstream
            {errors.placeAreaId && <small className="rm-field-error">{errors.placeAreaId}</small>}
          </div>
          <div className="rm-form-group rm-full-span">
            <label>Exact Location</label>
            <input name="exactLocation" value={form.exactLocation} onChange={handleChange} placeholder="Exact Location" className={errors.exactLocation ? "rm-input-error" : ""} />
            {errors.exactLocation && <small className="rm-field-error">{errors.exactLocation}</small>}
          </div>
          <div className="rm-form-group rm-full-span">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the incident" rows="5" className={errors.description ? "rm-input-error" : ""} />
            {errors.description && <small className="rm-field-error">{errors.description}</small>}
          </div>
          <div className="rm-form-group rm-full-span">
            <label>Evidence Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className={errors.file ? "rm-input-error" : ""} />
            {errors.file && <small className="rm-field-error">{errors.file}</small>}
          </div>
          <button type="submit" className="rm-btn rm-btn-light rm-wide-btn rm-full-span" disabled={loading}>{loading ? "Submitting..." : "SUBMIT"}</button>
=======
            {errors.placeAreaId && (
              <small className="rm-field-error">{errors.placeAreaId}</small>
            )}
          </div>

          <div className="rm-form-group rm-full-span">
            <label>Exact Location</label>
            <input
              name="exactLocation"
              value={form.exactLocation}
              onChange={handleChange}
              placeholder="Exact Location"
              className={errors.exactLocation ? "rm-input-error" : ""}
            />
            {errors.exactLocation && (
              <small className="rm-field-error">{errors.exactLocation}</small>
            )}
          </div>

          <div className="rm-form-group rm-full-span">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the incident"
              rows="5"
              className={errors.description ? "rm-input-error" : ""}
            />
            {errors.description && (
              <small className="rm-field-error">{errors.description}</small>
            )}
          </div>

          <div className="rm-form-group rm-full-span">
            <label>Evidence Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={errors.file ? "rm-input-error" : ""}
            />
            {errors.file && <small className="rm-field-error">{errors.file}</small>}
          </div>

          <button type="submit" className="rm-btn rm-btn-light rm-full-span" disabled={loading}>
            {loading ? "Submitting..." : "SUBMIT"}
          </button>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        </form>
      </div>
    </div>
  );
};
export default ReportIncidentPage;
