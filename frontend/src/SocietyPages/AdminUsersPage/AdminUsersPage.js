import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminUsersPage.css";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [tab, setTab] = useState("societies"); // "societies" | "owners"
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get("http://localhost:8080/api/society/all"),
      axios.get("http://localhost:8080/api/admin/stall-owners"),
    ]).then(([soc, own]) => {
      if (soc.status === "fulfilled") setSocieties(soc.value.data);
      if (own.status === "fulfilled") setOwners(own.value.data);
      setLoading(false);
    });
  }, []);

  const filtered = (tab === "societies" ? societies : owners).filter(item => {
    const q = search.toLowerCase();
    if (tab === "societies") {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.faculty?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.presidentName?.toLowerCase().includes(q)
      );
    } else {
      return (
        item.ownerName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.businessName?.toLowerCase().includes(q) ||
        item.productType?.toLowerCase().includes(q)
      );
    }
  });

  return (
    <div className="aup-page">
      <button className="aup-back" onClick={() => navigate(-1)}>←</button>

      <div className="aup-header">
        <span className="aup-eyebrow">Admin Portal</span>
        <h1 className="aup-title">Registered Users</h1>
        <p className="aup-sub">View all registered societies and stall owners on the platform.</p>
      </div>

      {/* Tabs */}
      <div className="aup-tabs">
        <button
          className={`aup-tab ${tab === "societies" ? "aup-tab--active" : ""}`}
          onClick={() => { setTab("societies"); setSearch(""); }}
        >
          🏛️ Societies
          <span className="aup-tab-count">{societies.length}</span>
        </button>
        <button
          className={`aup-tab ${tab === "owners" ? "aup-tab--active" : ""}`}
          onClick={() => { setTab("owners"); setSearch(""); }}
        >
          🏪 Stall Owners
          <span className="aup-tab-count">{owners.length}</span>
        </button>
      </div>

      {/* Search */}
      <div className="aup-search-row">
        <div className="aup-search-wrap">
          <span className="aup-search-icon">🔍</span>
          <input
            className="aup-search"
            placeholder={tab === "societies" ? "Search by name, faculty, email..." : "Search by name, business, email..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="aup-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <span className="aup-result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="aup-loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="aup-empty">No results found.</div>
      ) : tab === "societies" ? (
        <div className="aup-grid">
          {filtered.map(s => (
            <div key={s.id} className="aup-card">
              <div className="aup-card-avatar">{s.name?.charAt(0).toUpperCase()}</div>
              <div className="aup-card-body">
                <div className="aup-card-name">{s.name}</div>
                <div className="aup-card-meta">
                  <span>🎓 {s.faculty || "—"}</span>
                  <span>👤 {s.presidentName || "—"}</span>
                </div>
                <div className="aup-card-meta">
                  <span>✉️ {s.email}</span>
                  {s.contactNumber && <span>📞 {s.contactNumber}</span>}
                </div>
                {s.advisorName && (
                  <div className="aup-card-meta">
                    <span>🧑‍🏫 Advisor: {s.advisorName}</span>
                  </div>
                )}
              </div>
              <div className="aup-card-id">#{s.id}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="aup-grid">
          {filtered.map(o => (
            <div key={o.id} className="aup-card aup-card--owner">
              <div className="aup-card-avatar aup-card-avatar--owner">{o.ownerName?.charAt(0).toUpperCase()}</div>
              <div className="aup-card-body">
                <div className="aup-card-name">{o.ownerName}</div>
                <div className="aup-card-meta">
                  <span>🏢 {o.businessName || "—"}</span>
                  <span>📦 {o.productType || "—"}</span>
                </div>
                <div className="aup-card-meta">
                  <span>✉️ {o.email}</span>
                  {o.contactNumber && <span>📞 {o.contactNumber}</span>}
                </div>
                {o.address && (
                  <div className="aup-card-meta">
                    <span>📍 {o.address}</span>
                  </div>
                )}
              </div>
              <div className="aup-card-id">#{o.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
