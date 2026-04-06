import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminFacultyNotify.css";

const FACULTIES = [
  "Faculty of Computing",
  "Faculty of Engineering",
  "Faculty of Business",
  "Faculty of Humanities & Sciences",
  "Faculty of Architecture",
  "Faculty of Law",
  "Other",
];

const AdminFacultyNotify = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ deanName: "", deanEmail: "", facultyName: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sentIds, setSentIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [approvals, setApprovals] = useState([]);

  const fetchApprovals = () => {
    axios.get("http://localhost:8080/api/admin/events/dean-approvals")
      .then(r => setApprovals(r.data))
      .catch(console.error);
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/events")
      .then(r => setEvents(r.data.filter(e => e.status === "PENDING")))
      .catch(console.error);
    fetchApprovals();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e = {};
    if (!selected) e.event = "Please select an event.";
    if (!form.deanName.trim()) e.deanName = "Dean name is required.";
    if (!form.deanEmail.trim()) e.deanEmail = "Dean email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.deanEmail)) e.deanEmail = "Enter a valid email.";
    if (!form.facultyName) e.facultyName = "Please select a faculty.";
    return e;
  };

  const handleSend = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await axios.post(
        `http://localhost:8080/api/admin/events/${selected.id}/notify-faculty`,
        { deanName: form.deanName, deanEmail: form.deanEmail, facultyName: form.facultyName }
      );
      setSentIds(p => [...p, selected.id]);
      showToast(`Email sent to ${form.deanEmail}`);
      setForm({ deanName: "", deanEmail: "", facultyName: "" });
      setSelected(null);
      setErrors({});
      fetchApprovals();
    } catch (err) {
      showToast(err.response?.data || "Failed to send email.", "error");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    if (Array.isArray(d)) return `${d[0]}-${String(d[1]).padStart(2,"0")}-${String(d[2]).padStart(2,"0")}`;
    return String(d).slice(0, 10);
  };

  return (
    <div className="afn-page">
      <button className="afn-back" onClick={() => navigate(-1)}>← Back</button>

      {toast && <div className={`afn-toast afn-toast--${toast.type}`}>{toast.msg}</div>}

      <div className="afn-header">
        <span className="afn-eyebrow">Admin Portal</span>
        <h1 className="afn-title">Faculty Dean Notification</h1>
        <p className="afn-sub">Select a pending event and notify the relevant faculty dean via email before approving.</p>
      </div>

      <div className="afn-layout">

        {/* ── Event List ── */}
        <div className="afn-panel">
          <h2 className="afn-panel-title">📋 Pending Events <span className="afn-count">{events.length}</span></h2>
          {events.length === 0
            ? <p className="afn-empty">No pending events found.</p>
            : events.map(ev => (
              <div
                key={ev.id}
                className={`afn-event-card ${selected?.id === ev.id ? "afn-event-card--active" : ""} ${sentIds.includes(ev.id) ? "afn-event-card--sent" : ""}`}
                onClick={() => { setSelected(ev); setErrors({}); }}
              >
                <div className="afn-event-top">
                  <span className="afn-event-name">{ev.eventName}</span>
                  {sentIds.includes(ev.id) && <span className="afn-sent-badge">✓ Notified</span>}
                </div>
                <div className="afn-event-meta">
                  <span>🏛️ {ev.societyName || ev.societyId}</span>
                  <span>📅 {formatDate(ev.eventDate)}</span>
                  <span>📍 {ev.venue}</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* ── Compose Form ── */}
        <div className="afn-panel afn-form-panel">
          <h2 className="afn-panel-title">✉️ Compose Notification</h2>

          {/* Selected event preview */}
          {selected ? (
            <div className="afn-preview">
              <div className="afn-preview-label">Selected Event</div>
              <div className="afn-preview-name">{selected.eventName}</div>
              <div className="afn-preview-grid">
                <div><span>Society</span><strong>{selected.societyName || selected.societyId}</strong></div>
                <div><span>Date</span><strong>{formatDate(selected.eventDate)}</strong></div>
                <div><span>Time</span><strong>{selected.startTime} – {selected.endTime}</strong></div>
                <div><span>Venue</span><strong>{selected.venue}</strong></div>
                {selected.artists && <div className="afn-preview-full"><span>Artists</span><strong>{selected.artists}</strong></div>}
                {selected.description && <div className="afn-preview-full"><span>Description</span><strong>{selected.description}</strong></div>}
              </div>
            </div>
          ) : (
            <div className="afn-no-select">← Select an event from the list</div>
          )}
          {errors.event && <p className="afn-error">{errors.event}</p>}

          {/* Dean details */}
          <div className="afn-field">
            <label>Faculty</label>
            <select
              value={form.facultyName}
              onChange={e => { setForm(p => ({ ...p, facultyName: e.target.value })); setErrors(p => ({ ...p, facultyName: "" })); }}
            >
              <option value="">Select Faculty</option>
              {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {errors.facultyName && <p className="afn-error">{errors.facultyName}</p>}
          </div>

          <div className="afn-field">
            <label>Dean's Name</label>
            <input
              type="text"
              placeholder="e.g. Prof. John Silva"
              value={form.deanName}
              onChange={e => { setForm(p => ({ ...p, deanName: e.target.value })); setErrors(p => ({ ...p, deanName: "" })); }}
            />
            {errors.deanName && <p className="afn-error">{errors.deanName}</p>}
          </div>

          <div className="afn-field">
            <label>Dean's Email</label>
            <input
              type="email"
              placeholder="dean@university.edu"
              value={form.deanEmail}
              onChange={e => { setForm(p => ({ ...p, deanEmail: e.target.value })); setErrors(p => ({ ...p, deanEmail: "" })); }}
            />
            {errors.deanEmail && <p className="afn-error">{errors.deanEmail}</p>}
          </div>

          <button className="afn-send-btn" onClick={handleSend} disabled={sending}>
            {sending ? "Sending…" : "📧 Send Notification Email"}
          </button>
        </div>
      </div>

      {/* ── Dean Approval Responses ── */}
      {approvals.length > 0 && (
        <div className="afn-approvals-section">
          <div className="afn-approvals-header">
            <h2 className="afn-approvals-title">📬 Dean Approval Responses</h2>
            <div className="afn-approvals-counts">
              <span className="afn-acount afn-acount--pending">
                ⏳ {approvals.filter(a => a.response === "PENDING").length} Pending
              </span>
              <span className="afn-acount afn-acount--approved">
                ✅ {approvals.filter(a => a.response === "APPROVED").length} Approved
              </span>
              <span className="afn-acount afn-acount--rejected">
                ❌ {approvals.filter(a => a.response === "REJECTED").length} Rejected
              </span>
            </div>
          </div>

          <div className="afn-approvals-list">
            {approvals.map(a => (
              <div key={a.id} className={`afn-approval-row afn-approval-row--${a.response?.toLowerCase()}`}>
                <div className="afn-approval-left">
                  <span className={`afn-approval-badge afn-approval-badge--${a.response?.toLowerCase()}`}>
                    {a.response === "APPROVED" ? "✅ Approved" : a.response === "REJECTED" ? "❌ Rejected" : "⏳ Pending"}
                  </span>
                  <div className="afn-approval-event">{a.eventName}</div>
                  <div className="afn-approval-meta">
                    <span>🏛️ {a.facultyName}</span>
                    <span>👤 {a.deanName}</span>
                    <span>✉️ {a.deanEmail}</span>
                  </div>
                  {a.deanComment && (
                    <div className="afn-approval-comment">"{a.deanComment}"</div>
                  )}
                </div>
                <div className="afn-approval-right">
                  <span className="afn-approval-date">
                    {a.respondedAt
                      ? `Responded: ${new Date(a.respondedAt).toLocaleDateString()}`
                      : `Sent: ${new Date(a.sentAt).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFacultyNotify;
