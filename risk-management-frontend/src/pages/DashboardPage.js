import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalyticsSummary } from "../api/analyticsApi";
import { getAllIncidents, getIncidentsByPlace } from "../api/incidentApi";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [placeData, setPlaceData] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryData, placeResponse, incidentResponse] = await Promise.all([
        getAnalyticsSummary(),
        getIncidentsByPlace(),
        getAllIncidents(),
      ]);

      const sortedRecent = [...incidentResponse]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

      setSummary(summaryData);
      setPlaceData(placeResponse);
      setRecentIncidents(sortedRecent);
      setError("");
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = useMemo(() => {
    if (!summary) {
      return {
        activeCount: 0,
        completedCount: 0,
        resolutionRate: 0,
      };
    }

    const activeCount =
      summary.reportedCount + summary.assignedCount + summary.inActionCount;

    const completedCount = summary.resolvedCount + summary.closedCount;

    const resolutionRate =
      summary.totalIncidents > 0
        ? Math.round((completedCount / summary.totalIncidents) * 100)
        : 0;

    return {
      activeCount,
      completedCount,
      resolutionRate,
    };
  }, [summary]);

  const topPlace = useMemo(() => {
    if (!placeData.length) return null;
    return [...placeData].sort((a, b) => b.incidentCount - a.incidentCount)[0];
  }, [placeData]);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p>Monitor live operational status, priorities, and recent incident activity.</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {summary && (
        <>
          <div className="dashboard-hero">
            <div className="hero-text">
              <h3>Operational Snapshot</h3>
              <p>
                This dashboard gives a quick view of active incidents, completion
                progress, and the most affected place areas.
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-box">
                <span>Total Incidents</span>
                <strong>{summary.totalIncidents}</strong>
              </div>

              <div className="hero-stat-box">
                <span>Active Incidents</span>
                <strong>{dashboardStats.activeCount}</strong>
              </div>

              <div className="hero-stat-box">
                <span>Resolution Rate</span>
                <strong>{dashboardStats.resolutionRate}%</strong>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-section-header">
              <h3>Incident Status Overview</h3>
              <p>Track incidents by current workflow stage.</p>
            </div>

            <div className="grouped-stats-grid">
              <div className="group-card">
                <span className="group-label">Reported</span>
                <h4>{summary.reportedCount}</h4>
              </div>

              <div className="group-card">
                <span className="group-label">Assigned</span>
                <h4>{summary.assignedCount}</h4>
              </div>

              <div className="group-card">
                <span className="group-label">In Action</span>
                <h4>{summary.inActionCount}</h4>
              </div>

              <div className="group-card success-card">
                <span className="group-label">Resolved</span>
                <h4>{summary.resolvedCount}</h4>
              </div>

              <div className="group-card neutral-card">
                <span className="group-label">Closed</span>
                <h4>{summary.closedCount}</h4>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-section-header">
              <h3>Priority Distribution</h3>
              <p>Understand the severity level of reported incidents.</p>
            </div>

            <div className="grouped-stats-grid priority-grid">
              <div className="group-card critical-card">
                <span className="group-label">Critical</span>
                <h4>{summary.criticalCount}</h4>
              </div>

              <div className="group-card high-card">
                <span className="group-label">High</span>
                <h4>{summary.highCount}</h4>
              </div>

              <div className="group-card medium-card">
                <span className="group-label">Medium</span>
                <h4>{summary.mediumCount}</h4>
              </div>

              <div className="group-card low-card">
                <span className="group-label">Low</span>
                <h4>{summary.lowCount}</h4>
              </div>
            </div>
          </div>

          <div className="insight-strip">
            <div className="insight-card">
              <span>Most Affected Place</span>
              <strong>{topPlace ? topPlace.placeAreaName : "No data"}</strong>
            </div>

            <div className="insight-card">
              <span>Completed Incidents</span>
              <strong>{dashboardStats.completedCount}</strong>
            </div>

            <div className="insight-card">
              <span>System Status</span>
              <strong>
                {dashboardStats.activeCount > 0 ? "Attention Needed" : "Stable"}
              </strong>
            </div>
          </div>
        </>
      )}

      <div className="dashboard-panels">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Incident Counts by Place</h3>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Place ID</th>
                  <th>Place Name</th>
                  <th>Incident Count</th>
                </tr>
              </thead>
              <tbody>
                {placeData.length > 0 ? (
                  placeData.map((item) => (
                    <tr key={item.placeAreaId}>
                      <td>{item.placeAreaId}</td>
                      <td>{item.placeAreaName}</td>
                      <td>{item.incidentCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No place-based data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Recent Incidents</h3>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Place</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.length > 0 ? (
                  recentIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>{incident.id}</td>
                      <td>{incident.incidentType}</td>
                      <td>
                        <StatusBadge status={incident.status} />
                      </td>
                      <td>{incident.placeAreaName || "-"}</td>
                      <td>
                        <Link
                          to={`/incidents/${incident.id}`}
                          className="table-link-btn"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No incidents found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;