import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const navItems = [
  { icon: "⊞", label: "Dashboard",        path: "/admin",                    id: "dashboard" },
  { icon: "📋", label: "Event Approvals",  path: "/ad",                       id: "events" },
  { icon: "💳", label: "Stall Payments",   path: "/admin/pending-payments",   id: "payments" },
  { icon: "🎤", label: "Artist Mgmt",      path: "/organizer/search-artists", id: "artists" },
  { icon: "📧", label: "Faculty Notify",   path: "/admin/faculty-notify",     id: "faculty" },
  { icon: "👥", label: "Registered Users", path: "/admin/users",              id: "users" },
];

const quickCards = [
  {
    icon: "📋",
    title: "Event Approvals",
    desc: "Review, approve or reject event requests submitted by societies.",
    path: "/ad",
    accent: "#000000ff",
    tag: "Events",
  },
  {
    icon: "💳",
    title: "Stalls Payments",
    desc: "Review pending bank slip payments from stall owners.",
    path: "/admin/pending-payments",
    accent: "#000000ff",
    tag: "Payments",
  },
  {
    icon: "🎤",
    title: "Artist Management",
    desc: "Search artists, manage leads, send invitations and finalize performers.",
    path: "/organizer/search-artists",
    accent: "#000000ff",
    tag: "Artists",
  },
  {
    icon: "📧",
    title: "Deans & Faculty Approvals",
    desc: "Send event details to faculty deans via email before approving events.",
    path: "/admin/faculty-notify",
    accent: "#000000ff",
    tag: "Email",
  },
  {
    icon: "👥",
    title: "Registered Societies & Stall Owners",
    desc: "View all registered societies and stall owners with search and details.",
    path: "/admin/users",
    accent: "#000000ff",
    tag: "Users",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({ events: null, payments: null, artists: null, societies: null });

  useEffect(() => {
    const base = "http://localhost:8080";
    Promise.allSettled([
      axios.get(`${base}/api/admin/events/pending`),
      axios.get(`${base}/api/admin/pending-payments`),
      axios.get(`${base}/api/artists`),
      axios.get(`${base}/api/society/all`),
    ]).then(([ev, pay, art, soc]) => {
      setCounts({
        events:    ev.status  === "fulfilled" ? ev.value.data.length   : "—",
        payments:  pay.status === "fulfilled" ? pay.value.data.length  : "—",
        artists:   art.status === "fulfilled" ? art.value.data.length  : "—",
        societies: soc.status === "fulfilled" ? soc.value.data.length  : "—",
      });
    });
  }, []);

  const stats = [
    { label: "Pending Events",   value: counts.events,    icon: "📋", accent: "#8000f8" },
    { label: "Pending Payments", value: counts.payments,  icon: "💳", accent: "#0062ff" },
    { label: "Total Artists",    value: counts.artists,   icon: "🎤", accent: "#ec4899" },
    { label: "Active Societies", value: counts.societies, icon: "🏛️", accent: "#10b981" },
  ];

  return (
    <div className="adm-root">

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar ${collapsed ? "adm-sidebar--collapsed" : ""}`}>
        <div className="adm-sidebar-top">
          <div className="adm-logo">
            <span className="adm-logo-icon">⚡</span>
            {!collapsed && <span className="adm-logo-text">AdminHub</span>}
          </div>
          <button className="adm-collapse-btn" onClick={() => setCollapsed(p => !p)}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="adm-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item ${active === item.id ? "adm-nav-item--active" : ""}`}
              onClick={() => { setActive(item.id); if (item.id !== "dashboard") navigate(item.path); }}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              {!collapsed && <span className="adm-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-nav-item adm-nav-item--logout" onClick={() => navigate("/")}>
            <span className="adm-nav-icon">⏻</span>
            {!collapsed && <span className="adm-nav-label">Exit</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="adm-main">

        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <span className="adm-breadcrumb">Admin Portal</span>
            <span className="adm-breadcrumb-sep">/</span>
            <span className="adm-breadcrumb adm-breadcrumb--active">Dashboard</span>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-avatar">A</div>
            <div className="adm-topbar-info">
              <span className="adm-topbar-name">Admin</span>
              <span className="adm-topbar-role">Super Admin</span>
            </div>
          </div>
        </header>

        <div className="adm-content">

          {/* Welcome */}
          <div className="adm-welcome">
            <div>
              <h1 className="adm-welcome-title">Welcome back, <span className="adm-grad">Admin</span> 👋</h1>
              <p className="adm-welcome-sub">Here's what's happening across the platform today.</p>
            </div>
            <span className="adm-badge-portal">Admin Portal</span>
          </div>

          {/* Stats */}
          <div className="adm-stats">
            {stats.map(s => (
              <div key={s.label} className="adm-stat-card" style={{ "--acc": s.accent }}>
                <div className="adm-stat-icon">{s.icon}</div>
                <div className="adm-stat-info">
                  <span className="adm-stat-value">{s.value ?? <span className="adm-stat-loading">…</span>}</span>
                  <span className="adm-stat-label">{s.label}</span>
                </div>
                <div className="adm-stat-glow" />
              </div>
            ))}
          </div>

          {/* Quick Access */}
          <h2 className="adm-section-title">Quick Access</h2>
          <div className="adm-cards">
            {quickCards.map(c => (
              <div
                key={c.title}
                className="adm-card"
                style={{ "--accent": c.accent }}
                onClick={() => navigate(c.path)}
              >
                <div className="adm-card-top">
                  <span className="adm-card-tag" style={{ color: c.accent, borderColor: c.accent + "44", background: c.accent + "11" }}>{c.tag}</span>
                </div>
                <div className="adm-card-icon">{c.icon}</div>
                <h3 className="adm-card-title">{c.title}</h3>
                <p className="adm-card-desc">{c.desc}</p>
                <span className="adm-card-link" style={{ color: c.accent }}>Open module →</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
