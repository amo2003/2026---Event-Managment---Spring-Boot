import React, { useEffect, useState } from "react";
import { getAlerts } from "../api/alertApi";
import { getAnalyticsSummary, getPlaceCounts } from "../api/analyticsApi";
import { getAllIncidents } from "../api/incidentApi";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [placeCounts, setPlaceCounts] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryData, placeData, incidentData, alertData] = await Promise.all([
          getAnalyticsSummary(),
          getPlaceCounts(),
          getAllIncidents(),
          getAlerts(),
        ]);

        setSummary(summaryData);
        setPlaceCounts(placeData);
        setRecentIncidents(incidentData.slice(0, 5));
        setAlerts(alertData.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <Loader />;

  const totalIncidents = summary?.totalIncidents || 0;
  const activeIncidents =
    (summary?.reportedCount || 0) +
    (summary?.assignedCount || 0) +
    (summary?.inActionCount || 0);

  const lifecycleItems = [
    { label: "Reported", value: summary?.reportedCount || 0, tone: "reported" },
    { label: "Assigned", value: summary?.assignedCount || 0, tone: "assigned" },
    { label: "In Action", value: summary?.inActionCount || 0, tone: "in-action" },
    { label: "Resolved", value: summary?.resolvedCount || 0, tone: "resolved" },
    { label: "Closed", value: summary?.closedCount || 0, tone: "closed" },
  ];

  const priorityItems = [
    { label: "Critical", value: summary?.criticalCount || 0, tone: "critical" },
    { label: "High", value: summary?.highCount || 0, tone: "high" },
    { label: "Medium", value: summary?.mediumCount || 0, tone: "medium" },
    { label: "Low", value: summary?.lowCount || 0, tone: "low" },
  ];

  const maxPriorityValue = Math.max(...priorityItems.map((item) => item.value), 1);

  return (
    <div className="dashboard-page refined-dashboard">
      <section className="dashboard-hero refined-hero">
        <div className="hero-copy">
          <span className="section-kicker">Control Overview</span>
          <h2>Operational Snapshot</h2>
          <p>
            Review live incident movement, current response load, and risk priority
            distribution from one clean workspace.
          </p>
        </div>

        <div className="hero-summary-cards">
          <div className="summary-pill-card">
            <span>Total Incidents</span>
            <strong>{totalIncidents}</strong>
          </div>

          <div className="summary-pill-card">
            <span>Active Incidents</span>
            <strong>{activeIncidents}</strong>
          </div>

          <div className="summary-pill-card">
            <span>Resolved</span>
            <strong>{summary?.resolvedCount || 0}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-split-grid">
        <div className="page-card section-panel">
          <div className="section-head compact">
            <span className="section-kicker">Workflow</span>
            <h3>Incident Lifecycle</h3>
            <p>Current movement of incidents through the response process.</p>
          </div>

          <div className="lifecycle-stack">
            {lifecycleItems.map((item) => {
              const percentage =
                totalIncidents > 0 ? Math.round((item.value / totalIncidents) * 100) : 0;

              return (
                <div key={item.label} className="lifecycle-row">
                  <div className="lifecycle-meta">
                    <span className={`dot ${item.tone}`}></span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{percentage}% of total incidents</small>
                    </div>
                  </div>

                  <div className="lifecycle-progress-wrap">
                    <div className="lifecycle-progress-track">
                      <div
                        className={`lifecycle-progress-fill ${item.tone}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="lifecycle-value">{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="page-card section-panel">
          <div className="section-head compact">
            <span className="section-kicker">Risk View</span>
            <h3>Priority Distribution</h3>
            <p>Severity pattern of reported incidents across the current dataset.</p>
          </div>

          <div className="priority-bars">
            {priorityItems.map((item) => {
              const width = Math.max(10, Math.round((item.value / maxPriorityValue) * 100));

              return (
                <div key={item.label} className="priority-bar-card">
                  <div className="priority-bar-top">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>

                  <div className="priority-bar-track">
                    <div
                      className={`priority-bar-fill ${item.tone}`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="page-card section-panel">
          <div className="section-head compact">
            <span className="section-kicker">Locations</span>
            <h3>Incident Counts by Place</h3>
          </div>

          <div className="table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Place ID</th>
                  <th>Place Name</th>
                  <th>Incident Count</th>
                </tr>
              </thead>
              <tbody>
                {placeCounts.length === 0 ? (
                  <tr>
                    <td colSpan="3">No place data available.</td>
                  </tr>
                ) : (
                  placeCounts.map((item) => (
                    <tr key={item.placeAreaId}>
                      <td>{item.placeAreaId}</td>
                      <td>{item.placeAreaName}</td>
                      <td>{item.incidentCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-card section-panel">
          <div className="section-head compact">
            <span className="section-kicker">Attention</span>
            <h3>Recent Alerts</h3>
          </div>

          {alerts.length === 0 ? (
            <p className="empty-text">No alerts available.</p>
          ) : (
            <div className="alert-stack refined-alerts">
              {alerts.map((alert) => (
                <div key={alert.id} className="alert-card-lite">
                  <strong>{alert.title}</strong>
                  <p>{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-card section-panel">
        <div className="section-head compact">
          <span className="section-kicker">Recent Activity</span>
          <h3>Latest Incidents</h3>
        </div>

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Place</th>
                <th>Officer</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.length === 0 ? (
                <tr>
                  <td colSpan="5">No recent incidents found.</td>
                </tr>
              ) : (
                recentIncidents.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.incidentType}</td>
                    <td>
                      <StatusBadge value={item.status} />
                    </td>
                    <td>{item.placeAreaName}</td>
                    <td>{item.assignedOfficerName || "Pending"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;