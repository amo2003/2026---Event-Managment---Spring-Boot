import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminEventRequests.css";
import { useNavigate } from "react-router-dom";
import ChatPanel from "../../components/ChatPanel/ChatPanel";
import useUnreadCounts from "../../components/ChatPanel/useUnreadCounts";

const AdminPendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [chatEventId, setChatEventId] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [descEvent, setDescEvent] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();

  const eventIds = events.map(e => e.id);
  const { unreadMap, clearUnread } = useUnreadCounts(eventIds, "ADMIN");

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = () => {
    axios.get("http://localhost:8080/api/admin/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  };

  const approve = (id) => {
    axios.put(`http://localhost:8080/api/admin/events/approve/${id}`)
      .then(() => { fetchEvents(); setDetailEvent(null); })
      .catch(() => alert("Slot unavailable or error"));
  };

  const reject = (id) => {
    const msg = prompt("Enter rejection reason:");
    if (!msg) return;
    axios.put(`http://localhost:8080/api/admin/events/reject/${id}?message=${encodeURIComponent(msg)}`)
      .then(() => { fetchEvents(); setDetailEvent(null); })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="admin-events-scope">
        <button className="admin-back-btn" onClick={() => navigate(-1)}>←</button>

        <div className="admin-events-container">
          <h2 className="admin-events-title">Event Requests</h2>

          {/* Search Bar */}
          <div className="aer-search-bar">
            <input
              className="aer-search-input aer-search-date"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            {searchDate && (
              <button className="aer-clear-btn" onClick={() => setSearchDate("")}>
                ✕ Clear
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <p className="no-events">No event requests found.</p>
          ) : (() => {
            const filtered = events.filter(e => {
              if (!searchDate) return true;
              // Normalize eventDate to "YYYY-MM-DD" string regardless of format
              let evDate = "";
              if (Array.isArray(e.eventDate)) {
                const [y, m, d] = e.eventDate;
                evDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              } else if (e.eventDate) {
                // Could be "2026-04-01" or "2026-4-1" — normalize via Date object
                const parsed = new Date(e.eventDate);
                if (!isNaN(parsed)) {
                  evDate = parsed.toISOString().slice(0, 10);
                } else {
                  evDate = String(e.eventDate).slice(0, 10);
                }
              }
              console.log("eventDate raw:", e.eventDate, "→ normalized:", evDate, "| searchDate:", searchDate);
              return evDate === searchDate;
            });
            return filtered.length === 0 ? (
              <p className="no-events">No results match your search.</p>
            ) : (
            <table className="admin-events-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Society</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Artists</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="aer-row-clickable" onClick={() => setDetailEvent(event)}>
                    <td>{event.eventName}</td>
                    <td>{event.societyName || event.societyId}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.startTime} – {event.endTime}</td>
                    <td>{event.venue}</td>
                    <td>
                      {event.artists
                        ? event.artists.split(",").map((a, i) => (
                            <div key={i}>{i + 1}) {a.trim()}</div>
                          ))
                        : "—"}
                    </td>
                    <td
                      className="aer-desc-cell"
                      onClick={(e) => { e.stopPropagation(); if (event.description) setDescEvent(event); }}
                      title={event.description ? "Click to read" : ""}
                    >
                      {event.description
                        ? <span className="aer-desc-clickable">{event.description}</span>
                        : "—"}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {event.imageUrl ? (
                        <img
                          src={`http://localhost:8080/images/events/${event.imageUrl}`}
                          alt={event.eventName}
                          className="aer-event-img"
                          onClick={() => setModalImage(`http://localhost:8080/images/events/${event.imageUrl}`)}
                        />
                      ) : "—"}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <span className={`aer-status aer-status-${event.status?.toLowerCase().replace(/_/g, "-")}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="aer-actions-cell" onClick={(e) => e.stopPropagation()}>
                      {event.status === "PENDING" && (
                        <>
                          <button onClick={() => approve(event.id)} className="aer-approve-btn">✓ Approve</button>
                          <button onClick={() => reject(event.id)} className="aer-reject-btn">✕ Reject</button>
                        </>
                      )}
                      <div className="aer-chat-wrapper">
                        {unreadMap[event.id] > 0 && (
                          <span className="aer-unread-indicator">{unreadMap[event.id]} new</span>
                        )}
                        <button onClick={() => { setChatEventId(event.id); clearUnread(event.id); }} className="aer-chat-btn">
                          💬 Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            );
          })()}
        </div>
      </div>

      {/* ── Event Detail Popup ── */}
      {detailEvent && (
        <div className="aer-detail-overlay" onClick={() => setDetailEvent(null)}>
          <div className="aer-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="aer-detail-close" onClick={() => setDetailEvent(null)}>✕</button>

            {detailEvent.imageUrl && (
              <img
                src={`http://localhost:8080/images/events/${detailEvent.imageUrl}`}
                alt={detailEvent.eventName}
                className="aer-detail-img"
              />
            )}

            <div className="aer-detail-body">
              <h2 className="aer-detail-title">{detailEvent.eventName}</h2>
              <span className={`aer-status aer-status-${detailEvent.status?.toLowerCase().replace(/_/g, "-")}`}>
                {detailEvent.status}
              </span>

              <div className="aer-detail-grid">
                <div className="aer-detail-field">
                  <span className="aer-detail-label">Society</span>
                  <span className="aer-detail-value">{detailEvent.societyName || detailEvent.societyId}</span>
                </div>
                <div className="aer-detail-field">
                  <span className="aer-detail-label">Date</span>
                  <span className="aer-detail-value">{detailEvent.eventDate}</span>
                </div>
                <div className="aer-detail-field">
                  <span className="aer-detail-label">Time</span>
                  <span className="aer-detail-value">{detailEvent.startTime} – {detailEvent.endTime}</span>
                </div>
                <div className="aer-detail-field">
                  <span className="aer-detail-label">Venue</span>
                  <span className="aer-detail-value">{detailEvent.venue}</span>
                </div>
                <div className="aer-detail-field">
                  <span className="aer-detail-label">Contact</span>
                  <span className="aer-detail-value">{detailEvent.contactNumber || "—"}</span>
                </div>
                {detailEvent.artists && (
                  <div className="aer-detail-field aer-detail-full">
                    <span className="aer-detail-label">Artists</span>
                    <span className="aer-detail-value">
                      {detailEvent.artists.split(",").map((a, i) => (
                        <div key={i}>{i + 1}) {a.trim()}</div>
                      ))}
                    </span>
                  </div>
                )}
                {detailEvent.adminMessage && (
                  <div className="aer-detail-field aer-detail-full">
                    <span className="aer-detail-label">Admin Note</span>
                    <span className="aer-detail-value">{detailEvent.adminMessage}</span>
                  </div>
                )}
                {detailEvent.description && (
                  <div className="aer-detail-field aer-detail-full">
                    <span className="aer-detail-label">Description</span>
                    <span className="aer-detail-value">{detailEvent.description}</span>
                  </div>
                )}
              </div>

              {detailEvent.status === "PENDING" && (
                <div className="aer-detail-actions">
                  <button onClick={() => approve(detailEvent.id)} className="aer-approve-btn">✓ Approve</button>
                  <button onClick={() => reject(detailEvent.id)} className="aer-reject-btn">✕ Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Description Popup ── */}
      {descEvent && (
        <div className="aer-detail-overlay" onClick={() => setDescEvent(null)}>
          <div className="aer-desc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="aer-detail-close" onClick={() => setDescEvent(null)}>✕</button>
            <h3 className="aer-desc-modal-title">{descEvent.eventName}</h3>
            <p className="aer-desc-modal-text">{descEvent.description}</p>
          </div>
        </div>
      )}

      {/* ── Image Modal ── */}
      {modalImage && (
        <div className="aer-image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Preview" />
        </div>
      )}

      {/* ── Chat Panel ── */}
      {chatEventId && (
        <ChatPanel
          eventId={chatEventId}
          senderType="ADMIN"
          senderName="Admin"
          onClose={() => setChatEventId(null)}
        />
      )}
    </>
  );
};

export default AdminPendingEvents;
