import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminEventRequests.css";
import { useNavigate } from "react-router-dom";

const AdminPendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [modalImage, setModalImage] = useState(null); // Track image for modal

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:8080/api/admin/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  };

  const approve = (id) => {
    axios
      .put(`http://localhost:8080/api/admin/events/approve/${id}`)
      .then(() => fetchEvents())
      .catch(() => alert("Slot unavailable or error"));
  };

  const reject = (id) => {
    const msg = prompt("Enter rejection reason:");
    if (!msg) return;

    axios
      .put(
        `http://localhost:8080/api/admin/events/reject/${id}?message=${encodeURIComponent(msg)}`
      )
      .then(() => fetchEvents())
      .catch((err) => console.error(err));
  };

  return (
    <div className="admin-events-scope">
       <button className="admin-back-btn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="admin-events-container">
        <h2 className="admin-events-title">All Event Requests</h2>

        {events.length === 0 ? (
          <p className="no-events">No events available</p>
        ) : (
          <table className="admin-events-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Contact Number</th>
                <th>Venue</th>
                <th>Society</th>
                <th>Status</th>
                <th>Image</th>
                <th>Admin Message</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.eventName}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.startTime} - {event.endTime}</td>
                  <td>{event.contactNumber}</td>
                  <td>{event.venue}</td>
                  <td>{event.societyId}</td>
                  <td
                    className={`status-${event.status
                      ?.toLowerCase()
                      .replace(/_/g, "-")}`}
                  >
                    {event.status}
                  </td>

                  <td>
                    {event.imageUrl ? (
                      <img
                        src={`http://localhost:8080/images/events/${event.imageUrl}`}
                        alt={event.eventName}
                        className="event-image-preview"
                        onClick={() =>
                          setModalImage(`http://localhost:8080/images/events/${event.imageUrl}`)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{event.adminMessage || "-"}</td>

                  <td>
                    {event.status === "PENDING" && (
                      <>
                        <button onClick={() => approve(event.id)} className="approve-btn">
                          Approve
                        </button>

                        <button onClick={() => reject(event.id)} className="reject-btn">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Image Modal */}
        {modalImage && (
          <div className="image-modal" onClick={() => setModalImage(null)}>
            <img src={modalImage} alt="Preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPendingEvents;