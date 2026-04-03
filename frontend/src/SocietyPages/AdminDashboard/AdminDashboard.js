//import { useContext } from "react";
import { useNavigate } from "react-router-dom";
//import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

const cards = [
  {
    icon: "📋",
    title: "Event Approvals",
    desc: "Review, approve or reject event requests submitted by societies.",
    path: "/ad",
    accent: "#8000f8ff",
  },
  {
    icon: "💳",
    title: "Stall Payments",
    desc: "Review pending bank slip payments from stall owners and approve or reject them.",
    path: "/admin/pending-payments",
    accent: "#0062ffff",
  },
  {
    icon: "🎤",
    title: "Artist Management",
    desc: "Search artists, manage leads, send invitations, track votes and finalize performers.",
    path: "/organizer/search-artists",
    accent: "#ec4899",
  },
];

const AdminDashboard = () => {
  //const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="adm-page">
      <button className="adm-logout-btn" onClick={() => navigate("/")}>
        ✕
      </button>

      {/* Header */}
      <div className="adm-header">
        <span className="adm-eyebrow">Admin Portal</span>
        <h1>Welcome, <span className="adm-name">Admin</span></h1>
        <p className="adm-subtitle">Manage event approvals and stall payments from here.</p>
      </div>

      {/* Cards */}
      <div className="adm-cards">
        {cards.map((c) => (
          <div
            key={c.title}
            className="adm-card"
            style={{ "--accent": c.accent }}
            onClick={() => navigate(c.path)}
          >
            <div className="adm-card-icon">{c.icon}</div>
            <h2 className="adm-card-title">{c.title}</h2>
            <p className="adm-card-desc">{c.desc}</p>
            <span className="adm-card-link">Open →</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
