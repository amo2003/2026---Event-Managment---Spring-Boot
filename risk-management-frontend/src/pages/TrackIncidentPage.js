import { useState } from "react";
import { trackIncident } from "../api/incidentApi";
import StatusBadge from "../components/common/StatusBadge";
import { isValidTrackingCode } from "../utils/validation";

const statusGuide = [
  {
    title: "Reported",
    text: "Your incident has been submitted successfully and is waiting for operational review.",
  },
  {
    title: "Assigned",
    text: "An officer has been assigned to handle the incident.",
  },
  {
    title: "In Action",
    text: "The response team is actively working on the incident.",
  },
  {
    title: "Resolved",
    text: "The issue has been handled and a resolution has been recorded.",
  },
  {
    title: "Closed",
    text: "The incident workflow is fully completed and closed.",
  },
];

function TrackIncidentPage() {
  const [formData, setFormData] = useState({
    trackingCode: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searching, setSearching] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!formData.trackingCode.trim()) {
      errors.trackingCode = "Tracking code is required.";
    } else if (!isValidTrackingCode(formData.trackingCode)) {
      errors.trackingCode = "Tracking code format is invalid. Example: RISK-2026-AB12CD";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
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
      setSearching(true);
      setErrorMessage("");
      setSuccessMessage("");
      setResult(null);

      const response = await trackIncident({
        trackingCode: formData.trackingCode,
      });

      setResult(response);
      setSuccessMessage("Incident found successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "No matching incident found."
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="track-page-layout">
      <div className="track-main-grid">
        <div className="public-page-card">
          <div className="page-header">
            <h2>Track My Incident</h2>
            <p>Use your tracking code to check the current status of your report.</p>
          </div>

          {successMessage && <div className="success-box">{successMessage}</div>}
          {errorMessage && <div className="error-box">{errorMessage}</div>}

          <form className="custom-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Tracking Code</label>
                <input
                  type="text"
                  name="trackingCode"
                  value={formData.trackingCode}
                  onChange={handleChange}
                  placeholder="Enter your tracking code"
                  className={fieldErrors.trackingCode ? "input-error" : ""}
                />
                {fieldErrors.trackingCode && (
                  <div className="field-error">{fieldErrors.trackingCode}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={searching}>
                {searching ? "Searching..." : "Track Incident"}
              </button>
            </div>
          </form>

          {result && (
            <div className="tracking-result-card">
              <h3>Incident Status Result</h3>

              <div className="tracking-grid">
                <div className="tracking-item">
                  <span>Tracking Code</span>
                  <strong>{result.trackingCode}</strong>
                </div>

                <div className="tracking-item">
                  <span>Type</span>
                  <strong>{result.incidentType}</strong>
                </div>

                <div className="tracking-item">
                  <span>Status</span>
                  <strong>
                    <StatusBadge status={result.status} />
                  </strong>
                </div>

                <div className="tracking-item">
                  <span>Priority</span>
                  <strong>{result.priority}</strong>
                </div>

                <div className="tracking-item">
                  <span>Place</span>
                  <strong>{result.placeAreaName || "-"}</strong>
                </div>

                <div className="tracking-item">
                  <span>Assigned Officer</span>
                  <strong>{result.assignedOfficerName || "Not Assigned Yet"}</strong>
                </div>

                <div className="tracking-item full-width">
                  <span>Exact Location</span>
                  <strong>{result.exactLocation}</strong>
                </div>
              </div>

              <div className="detail-description">
                <span>Description</span>
                <p>{result.description}</p>
              </div>

              {result.resolutionSummary && (
                <div className="detail-description tracking-resolution-box">
                  <span>Resolution Summary</span>
                  <p>{result.resolutionSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="track-side-panel">
          <div className="track-info-card">
            <h3>How tracking works</h3>

            <div className="track-step">
              <div className="track-step-number">1</div>
              <div>
                <strong>Report an incident</strong>
                <p>Submit your incident details from the public reporting page.</p>
              </div>
            </div>

            <div className="track-step">
              <div className="track-step-number">2</div>
              <div>
                <strong>Save the tracking code</strong>
                <p>After submission, the system gives you a unique tracking code.</p>
              </div>
            </div>

            <div className="track-step">
              <div className="track-step-number">3</div>
              <div>
                <strong>Check status anytime</strong>
                <p>Enter the code here to see incident progress and handling status.</p>
              </div>
            </div>
          </div>

          <div className="track-help-card">
            <h3>Helpful tips</h3>
            <ul>
              <li>Enter the tracking code exactly as shown after submission.</li>
              <li>Tracking code format looks like: <strong>RISK-2026-AB12CD</strong></li>
              <li>Save the code safely after reporting the incident.</li>
              <li>If you cannot find your code, contact the event operations desk.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="track-status-section">
        <div className="feature-section-header">
          <h2>Incident Status Guide</h2>
          <p>These are the normal workflow stages you may see while tracking an incident.</p>
        </div>

        <div className="track-status-grid">
          {statusGuide.map((item) => (
            <div className="track-status-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrackIncidentPage;