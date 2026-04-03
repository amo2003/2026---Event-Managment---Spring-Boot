import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filterIncidents, getAllIncidents, updateIncidentStatus } from "../api/incidentApi";
import { getPlaceAreas } from "../api/placeAreaApi";
import StatusBadge from "../components/common/StatusBadge";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";

const IncidentListPage = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [placeAreas, setPlaceAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterForm, setFilterForm] = useState({
    status: "",
    priority: "",
    incidentType: "",
    placeAreaId: "",
    reportedBy: "",
  });
  const [error, setError] = useState("");

  const loadInitial = async () => {
    try {
      const [incidentData, placesData] = await Promise.all([
        getAllIncidents(),
        getPlaceAreas(),
      ]);
      setIncidents(incidentData);
      setPlaceAreas(placesData);
    } catch (err) {
      setError("Failed to load incidents data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const isAssignedToLoggedInOfficer = (incident) => {
    if (!incident.assignedOfficerName || !user?.fullName) return false;

    return (
      incident.assignedOfficerName.trim().toLowerCase() ===
      user.fullName.trim().toLowerCase()
    );
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        status: filterForm.status || null,
        priority: filterForm.priority || null,
        incidentType: filterForm.incidentType || null,
        placeAreaId: filterForm.placeAreaId ? Number(filterForm.placeAreaId) : null,
        reportedBy: filterForm.reportedBy || null,
      };

      const data = await filterIncidents(payload);
      setIncidents(data);
    } catch (err) {
      setError(err.response?.data?.message || "Filtering failed.");
    }
  };

  const handleReset = async () => {
    setFilterForm({
      status: "",
      priority: "",
      incidentType: "",
      placeAreaId: "",
      reportedBy: "",
    });
    setLoading(true);
    await loadInitial();
  };

  const handleStatusUpdate = async (incidentId, status) => {
    try {
      let resolutionSummary = "";

      if (status === "RESOLVED") {
        resolutionSummary = window.prompt("Enter resolution summary:");
        if (!resolutionSummary) return;
      }

      await updateIncidentStatus(incidentId, {
        status,
        actionBy: user?.fullName || "Officer",
        resolutionSummary,
      });

      await loadInitial();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const renderActionCell = (item) => {
    if (!item.assignedOfficerName) {
      return <span className="muted-note">Awaiting auto-assignment</span>;
    }

    if (!isAssignedToLoggedInOfficer(item)) {
      return (
        <span className="muted-note">
          Assigned to {item.assignedOfficerName}
        </span>
      );
    }

    if (item.status === "ASSIGNED") {
      return (
        <button
          className="mini-btn"
          onClick={() => handleStatusUpdate(item.id, "IN_ACTION")}
        >
          Start Action
        </button>
      );
    }

    if (item.status === "IN_ACTION") {
      return (
        <button
          className="mini-btn success"
          onClick={() => handleStatusUpdate(item.id, "RESOLVED")}
        >
          Resolve
        </button>
      );
    }

    if (item.status === "RESOLVED" || item.status === "CLOSED") {
      return <span className="muted-note">Completed</span>;
    }

    return <span className="muted-note">No action required</span>;
  };

  if (loading) return <Loader />;

  return (
    <div className="page-stack">
      <div className="page-card">
        <div className="section-head">
          <h2>Incident List</h2>
          <p>View, filter, and update incident workflow in one place.</p>
        </div>

        {error && <div className="message-box error">{error}</div>}

        <form onSubmit={handleFilter} className="form-grid">
          <div className="form-group">
            <label>Status</label>
            <select
              value={filterForm.status}
              onChange={(e) => setFilterForm({ ...filterForm, status: e.target.value })}
            >
              <option value="">All statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_ACTION">In Action</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={filterForm.priority}
              onChange={(e) => setFilterForm({ ...filterForm, priority: e.target.value })}
            >
              <option value="">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Incident Type</label>
            <select
              value={filterForm.incidentType}
              onChange={(e) => setFilterForm({ ...filterForm, incidentType: e.target.value })}
            >
              <option value="">All incident types</option>
              <option value="FIGHT">Fight</option>
              <option value="MEDICAL">Medical</option>
              <option value="FIRE">Fire</option>
              <option value="SECURITY">Security</option>
              <option value="CROWD_CONTROL">Crowd Control</option>
              <option value="TECHNICAL">Technical</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Place Area</label>
            <select
              value={filterForm.placeAreaId}
              onChange={(e) => setFilterForm({ ...filterForm, placeAreaId: e.target.value })}
            >
              <option value="">All places</option>
              {placeAreas.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-span">
            <label>Reported By</label>
            <input
              value={filterForm.reportedBy}
              onChange={(e) => setFilterForm({ ...filterForm, reportedBy: e.target.value })}
              placeholder="Search by reporter name"
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn btn-primary">
              Apply Filter
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="page-card">
        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Place</th>
                <th>Officer</th>
                <th>Update Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="9">No incidents found.</td>
                </tr>
              ) : (
                incidents.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.incidentType}</td>
                    <td>{item.priority}</td>
                    <td><StatusBadge value={item.status} /></td>
                    <td>{item.reportedBy}</td>
                    <td>{item.placeAreaName}</td>
                    <td>{item.assignedOfficerName || "Pending"}</td>
                    <td>{renderActionCell(item)}</td>
                    <td>
                      <Link to={`/incidents/${item.id}`} className="mini-btn dark">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncidentListPage;