import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createIncident } from "../api/incidentApi";
import { getAllPlaceAreas } from "../api/placeAreaApi";
import { isValidImageFile } from "../utils/validation";

function ReportIncidentPage() {
  const [formData, setFormData] = useState({
    incidentType: "",
    priority: "",
    description: "",
    reportedBy: "",
    placeAreaId: "",
    exactLocation: "",
    file: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [placeAreas, setPlaceAreas] = useState([]);
  const [submittedIncident, setSubmittedIncident] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPlaceAreas();
  }, []);

  const loadPlaceAreas = async () => {
    try {
      const data = await getAllPlaceAreas();
      setPlaceAreas(data);
    } catch (error) {
      setPlaceAreas([
        { id: 1, name: "Main Building" },
        { id: 2, name: "New Building" },
        { id: 3, name: "Playground" },
        { id: 4, name: "Auditorium" },
        { id: 5, name: "Outdoor space" },
        { id: 6, name: "Buiseness faculty" },
        { id: 7, name: "Birdnest" },
      ]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.incidentType) errors.incidentType = "Incident type is required.";
    if (!formData.reportedBy.trim()) {
      errors.reportedBy = "Reporter name is required.";
    } else if (formData.reportedBy.trim().length < 3) {
      errors.reportedBy = "Reporter name must be at least 3 characters.";
    }

    if (!formData.placeAreaId) errors.placeAreaId = "Place area is required.";

    if (!formData.exactLocation.trim()) {
      errors.exactLocation = "Exact location is required.";
    } else if (formData.exactLocation.trim().length < 5) {
      errors.exactLocation = "Exact location must be at least 5 characters.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    if (!isValidImageFile(formData.file)) {
      errors.file = "Only JPG, PNG, or WEBP images up to 5MB are allowed.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const selectedFile = files && files.length > 0 ? files[0] : null;
      setFormData((prev) => ({
        ...prev,
        file: selectedFile,
      }));
      setFieldErrors((prev) => ({ ...prev, file: "" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setSuccessMessage("");
      setErrorMessage("");
      setSubmittedIncident(null);

      const payload = {
        incidentType: formData.incidentType,
        priority: formData.priority || null,
        description: formData.description,
        reportedBy: formData.reportedBy,
        placeAreaId: Number(formData.placeAreaId),
        exactLocation: formData.exactLocation,
        file: formData.file,
      };

      const response = await createIncident(payload);

      setSubmittedIncident(response);
      setSuccessMessage("Incident reported successfully.");
      setFormData({
        incidentType: "",
        priority: "",
        description: "",
        reportedBy: "",
        placeAreaId: "",
        exactLocation: "",
        file: null,
      });
      setFieldErrors({});
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to submit incident."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page-card">
      <div className="page-header">
        <h2>Report New Incident</h2>
        <p>Submit a new risk or incident record into the system.</p>
      </div>

      {successMessage && <div className="success-box">{successMessage}</div>}
      {errorMessage && <div className="error-box">{errorMessage}</div>}

      {submittedIncident && (
        <div className="tracking-info-box">
          <h3>Your incident was submitted.</h3>
          <p>Save this tracking code carefully. You can use it later on the Track Incident page.</p>
          <p><strong>Tracking Code:</strong> {submittedIncident.trackingCode}</p>
          <Link to="/track-incident" className="public-secondary-btn inline-track-btn">
            Go to Track Incident
          </Link>
        </div>
      )}

      <div className="form-card">
        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Incident Type</label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                className={fieldErrors.incidentType ? "input-error" : ""}
              >
                <option value="">Select incident type</option>
                <option value="MEDICAL">Medical</option>
                <option value="FIRE">Fire</option>
                <option value="FIGHT">Fight</option>
                <option value="SECURITY">Security</option>
                <option value="TECHNICAL">Technical</option>
                <option value="CROWD_CONTROL">Crowd Control</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.incidentType && <div className="field-error">{fieldErrors.incidentType}</div>}
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="">Auto suggest</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reported By</label>
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleChange}
                placeholder="Enter reporter name"
                className={fieldErrors.reportedBy ? "input-error" : ""}
              />
              {fieldErrors.reportedBy && <div className="field-error">{fieldErrors.reportedBy}</div>}
            </div>

            <div className="form-group">
              <label>Place Area</label>
              <select
                name="placeAreaId"
                value={formData.placeAreaId}
                onChange={handleChange}
                className={fieldErrors.placeAreaId ? "input-error" : ""}
              >
                <option value="">Select place area</option>
                {placeAreas.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
              {fieldErrors.placeAreaId && <div className="field-error">{fieldErrors.placeAreaId}</div>}
            </div>

            <div className="form-group full-width">
              <label>Exact Location Details</label>
              <input
                type="text"
                name="exactLocation"
                value={formData.exactLocation}
                onChange={handleChange}
                placeholder="Example: Near front gate, beside security desk"
                className={fieldErrors.exactLocation ? "input-error" : ""}
              />
              {fieldErrors.exactLocation && <div className="field-error">{fieldErrors.exactLocation}</div>}
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the incident clearly"
                rows="6"
                className={fieldErrors.description ? "input-error" : ""}
              />
              {fieldErrors.description && <div className="field-error">{fieldErrors.description}</div>}
            </div>

            <div className="form-group full-width">
              <label>Upload Supporting Image (Optional)</label>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                className={fieldErrors.file ? "input-error" : ""}
              />
              {fieldErrors.file && <div className="field-error">{fieldErrors.file}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIncidentPage;