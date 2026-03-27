import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  assignOfficer,
  autoAssignOfficer,
  filterIncidents,
  getAllIncidents,
  updateIncidentStatus,
} from "../api/incidentApi";
import { getAllOfficers } from "../api/officerApi";
import { getAllPlaceAreas } from "../api/placeAreaApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";

const statusOptions = ["REPORTED", "ASSIGNED", "IN_ACTION", "RESOLVED", "CLOSED"];
const priorityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const incidentTypes = [
  "MEDICAL",
  "FIRE",
  "FIGHT",
  "SECURITY",
  "TECHNICAL",
  "CROWD_CONTROL",
  "OTHER",
];

function IncidentListPage() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === "ADMIN";

  const [incidents, setIncidents] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [placeAreas, setPlaceAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [filterForm, setFilterForm] = useState({
    status: "",
    priority: "",
    incidentType: "",
    placeAreaId: "",
    reportedBy: "",
  });

  const [selectedOfficerByIncident, setSelectedOfficerByIncident] = useState({});
  const [selectedStatusByIncident, setSelectedStatusByIncident] = useState({});
  const [resolutionSummaryByIncident, setResolutionSummaryByIncident] = useState({});

  useEffect(() => {
    loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const loadPageData = async () => {
    try {
      setLoading(true);

      const incidentPromise = getAllIncidents();
      const placePromise = getAllPlaceAreas();

      if (isAdmin) {
        const [incidentData, officerData, placeData] = await Promise.all([
          incidentPromise,
          getAllOfficers(),
          placePromise,
        ]);

        setIncidents(incidentData);
        setOfficers(officerData);
        setPlaceAreas(placeData);
      } else {
        const [incidentData, placeData] = await Promise.all([
          incidentPromise,
          placePromise,
        ]);

        setIncidents(incidentData);
        setOfficers([]);
        setPlaceAreas(placeData);
      }

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to load incidents data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildFilterPayload = () => {
    const payload = {};

    if (filterForm.status) payload.status = filterForm.status;
    if (filterForm.priority) payload.priority = filterForm.priority;
    if (filterForm.incidentType) payload.incidentType = filterForm.incidentType;
    if (filterForm.placeAreaId) payload.placeAreaId = Number(filterForm.placeAreaId);
    if (filterForm.reportedBy.trim()) payload.reportedBy = filterForm.reportedBy.trim();

    return payload;
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = buildFilterPayload();
      const data = await filterIncidents(payload);
      setIncidents(data);
      setSuccessMessage("Filter applied successfully.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to filter incidents."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setFilterForm({
      status: "",
      priority: "",
      incidentType: "",
      placeAreaId: "",
      reportedBy: "",
    });
    setSuccessMessage("");
    await loadPageData();
  };

  const handleAssign = async (incidentId) => {
    const officerId = selectedOfficerByIncident[incidentId];

    if (!officerId) {
      setErrorMessage("Please select an officer first.");
      return;
    }

    try {
      await assignOfficer(incidentId, Number(officerId));
      setSuccessMessage("Officer assigned successfully.");
      setErrorMessage("");
      await loadPageData();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to assign officer."
      );
    }
  };

  const handleAutoAssign = async (incidentId) => {
    try {
      await autoAssignOfficer(incidentId);
      setSuccessMessage("Officer auto-assigned successfully.");
      setErrorMessage("");
      await loadPageData();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to auto assign officer."
      );
    }
  };

  const handleStatusUpdate = async (incidentId) => {
    const status = selectedStatusByIncident[incidentId];

    if (!status) {
      setErrorMessage("Please select a status first.");
      return;
    }

    const payload = {
      status,
      actionBy: authUser?.fullName || "Frontend User",
      resolutionSummary:
        status === "RESOLVED" ? resolutionSummaryByIncident[incidentId] || "" : "",
    };

    try {
      await updateIncidentStatus(incidentId, payload);
      setSuccessMessage("Incident status updated successfully.");
      setErrorMessage("");
      await loadPageData();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to update incident status."
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="list-page">
      <div className="page-header">
        <h2>Incident List</h2>
        <p>View, filter, update, and inspect incidents in one place.</p>
      </div>

      {successMessage && <div className="success-box">{successMessage}</div>}
      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="form-card section-space">
        <h3 className="section-title">Filter Incidents</h3>

        <form onSubmit={handleFilterSubmit}>
          <div className="filter-grid">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={filterForm.status} onChange={handleFilterChange}>
                <option value="">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={filterForm.priority} onChange={handleFilterChange}>
                <option value="">All priorities</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Incident Type</label>
              <select
                name="incidentType"
                value={filterForm.incidentType}
                onChange={handleFilterChange}
              >
                <option value="">All incident types</option>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Place Area</label>
              <select
                name="placeAreaId"
                value={filterForm.placeAreaId}
                onChange={handleFilterChange}
              >
                <option value="">All places</option>
                {placeAreas.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Reported By</label>
              <input
                type="text"
                name="reportedBy"
                value={filterForm.reportedBy}
                onChange={handleFilterChange}
                placeholder="Search by reporter name"
              />
            </div>
          </div>

          <div className="form-actions button-row">
            <button type="submit" className="primary-btn">
              Apply Filter
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tracking Code</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Place</th>
                <th>Officer</th>
                {isAdmin && <th>Assign</th>}
                <th>Update Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.trackingCode || "-"}</td>
                    <td>{incident.incidentType}</td>
                    <td>
                      <span
                        className={`priority-badge priority-${incident.priority?.toLowerCase()}`}
                      >
                        {incident.priority}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={incident.status} />
                    </td>
                    <td>{incident.reportedBy}</td>
                    <td>{incident.placeAreaName || "-"}</td>
                    <td>{incident.assignedOfficerName || "Not Assigned"}</td>

                    {isAdmin && (
                      <td>
                        {!incident.assignedOfficerName ? (
                          <div className="action-stack">
                            <select
                              className="mini-select"
                              value={selectedOfficerByIncident[incident.id] || ""}
                              onChange={(e) =>
                                setSelectedOfficerByIncident((prev) => ({
                                  ...prev,
                                  [incident.id]: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select officer</option>
                              {officers.map((officer) => (
                                <option key={officer.id} value={officer.id}>
                                  {officer.fullName}
                                </option>
                              ))}
                            </select>

                            <div className="button-row">
                              <button
                                type="button"
                                className="small-btn"
                                onClick={() => handleAssign(incident.id)}
                              >
                                Assign
                              </button>

                              <button
                                type="button"
                                className="small-btn secondary-small-btn"
                                onClick={() => handleAutoAssign(incident.id)}
                              >
                                Auto
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="small-note">Already assigned</span>
                        )}
                      </td>
                    )}

                    <td>
                      <div className="action-stack">
                        <select
                          className="mini-select"
                          value={selectedStatusByIncident[incident.id] || ""}
                          onChange={(e) =>
                            setSelectedStatusByIncident((prev) => ({
                              ...prev,
                              [incident.id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select status</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {selectedStatusByIncident[incident.id] === "RESOLVED" && (
                          <input
                            className="mini-input"
                            type="text"
                            placeholder="Resolution summary"
                            value={resolutionSummaryByIncident[incident.id] || ""}
                            onChange={(e) =>
                              setResolutionSummaryByIncident((prev) => ({
                                ...prev,
                                [incident.id]: e.target.value,
                              }))
                            }
                          />
                        )}

                        <button
                          type="button"
                          className="small-btn success-small-btn"
                          onClick={() => handleStatusUpdate(incident.id)}
                        >
                          Update
                        </button>
                      </div>
                    </td>

                    <td>
                      <Link
                        to={`/incidents/${incident.id}`}
                        className="table-link-btn"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? "11" : "10"}>No incidents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IncidentListPage;