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
    Promise.all([getAnalyticsSummary(), getPlaceCounts(), getAllIncidents(), getAlerts()])
      .then(([s, p, i, a]) => { setSummary(s); setPlaceCounts(p); setRecentIncidents(i.slice(0,5)); setAlerts(a.slice(0,4)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const total = summary?.totalIncidents || 0;
  const active = (summary?.reportedCount||0) + (summary?.assignedCount||0) + (summary?.inActionCount||0);

  const lifecycle = [
    { label:"Reported",  value:summary?.reportedCount||0,  tone:"reported"  },
    { label:"Assigned",  value:summary?.assignedCount||0,  tone:"assigned"  },
    { label:"In Action", value:summary?.inActionCount||0,  tone:"in-action" },
    { label:"Resolved",  value:summary?.resolvedCount||0,  tone:"resolved"  },
    { label:"Closed",    value:summary?.closedCount||0,    tone:"closed"    },
  ];
  const priorities = [
    { label:"Critical", value:summary?.criticalCount||0, tone:"critical" },
    { label:"High",     value:summary?.highCount||0,     tone:"high"     },
    { label:"Medium",   value:summary?.mediumCount||0,   tone:"medium"   },
    { label:"Low",      value:summary?.lowCount||0,      tone:"low"      },
  ];
  const maxP = Math.max(...priorities.map(p => p.value), 1);

  return (
    <div className="rm-dashboard-page rm-refined-dashboard">
      <section className="rm-refined-hero">
        <div className="rm-hero-copy">
          <span className="rm-section-kicker">Control Overview</span>
          <h2>Operational Snapshot</h2>
          <p>Review live incident movement, current response load, and risk priority distribution from one clean workspace.</p>
        </div>
        <div className="rm-hero-summary-cards">
          <div className="rm-summary-pill-card"><span>Total Incidents</span><strong>{total}</strong></div>
          <div className="rm-summary-pill-card"><span>Active Incidents</span><strong>{active}</strong></div>
          <div className="rm-summary-pill-card"><span>Resolved</span><strong>{summary?.resolvedCount||0}</strong></div>
        </div>
      </section>

      <section className="rm-dashboard-split-grid">
        <div className="rm-page-card rm-section-panel">
          <div className="rm-section-head rm-compact">
            <span className="rm-section-kicker">Workflow</span>
            <h3>Incident Lifecycle</h3>
            <p>Current movement of incidents through the response process.</p>
          </div>
          <div className="rm-lifecycle-stack">
            {lifecycle.map(item => {
              const pct = total > 0 ? Math.round((item.value/total)*100) : 0;
              return (
                <div key={item.label} className="rm-lifecycle-row">
                  <div className="rm-lifecycle-meta">
                    <span className={`rm-dot ${item.tone}`}></span>
                    <div><strong>{item.label}</strong><small>{pct}% of total</small></div>
                  </div>
                  <div className="rm-lifecycle-progress-wrap">
                    <div className="rm-lifecycle-progress-track">
                      <div className={`rm-lifecycle-progress-fill ${item.tone}`} style={{width:`${pct}%`}}></div>
                    </div>
                  </div>
                  <div className="rm-lifecycle-value">{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rm-page-card rm-section-panel">
          <div className="rm-section-head rm-compact">
            <span className="rm-section-kicker">Risk View</span>
            <h3>Priority Distribution</h3>
            <p>Severity pattern of reported incidents.</p>
          </div>
          <div className="rm-priority-bars">
            {priorities.map(item => (
              <div key={item.label} className="rm-priority-bar-card">
                <div className="rm-priority-bar-top"><span>{item.label}</span><strong>{item.value}</strong></div>
                <div className="rm-priority-bar-track">
                  <div className={`rm-priority-bar-fill ${item.tone}`} style={{width:`${Math.max(10,Math.round((item.value/maxP)*100))}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rm-dashboard-bottom-grid">
        <div className="rm-page-card rm-section-panel">
          <div className="rm-section-head rm-compact"><span className="rm-section-kicker">Locations</span><h3>Incident Counts by Place</h3></div>
          <div className="rm-table-wrap">
            <table className="rm-app-table">
              <thead><tr><th>Place ID</th><th>Place Name</th><th>Incident Count</th></tr></thead>
              <tbody>
                {placeCounts.length === 0 ? <tr><td colSpan="3">No place data available.</td></tr>
                  : placeCounts.map(item => <tr key={item.placeAreaId}><td>{item.placeAreaId}</td><td>{item.placeAreaName}</td><td>{item.incidentCount}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rm-page-card rm-section-panel">
          <div className="rm-section-head rm-compact"><span className="rm-section-kicker">Attention</span><h3>Recent Alerts</h3></div>
          {alerts.length === 0 ? <p className="rm-empty-text">No alerts available.</p>
            : <div className="rm-refined-alerts">
                {alerts.map(a => <div key={a.id} className="rm-alert-card-lite"><strong>{a.title}</strong><p>{a.message}</p></div>)}
              </div>}
        </div>
      </section>

      <section className="rm-page-card rm-section-panel">
        <div className="rm-section-head rm-compact"><span className="rm-section-kicker">Recent Activity</span><h3>Latest Incidents</h3></div>
        <div className="rm-table-wrap">
          <table className="rm-app-table">
            <thead><tr><th>ID</th><th>Type</th><th>Status</th><th>Place</th><th>Officer</th></tr></thead>
            <tbody>
              {recentIncidents.length === 0 ? <tr><td colSpan="5">No recent incidents found.</td></tr>
                : recentIncidents.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td><td>{item.incidentType}</td>
                    <td><StatusBadge value={item.status} /></td>
                    <td>{item.placeAreaName}</td><td>{item.assignedOfficerName||"Pending"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default DashboardPage;
