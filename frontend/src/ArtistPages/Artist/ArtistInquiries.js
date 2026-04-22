import React, { useContext, useEffect, useState } from "react";
import inquiryService from "../../services/inquiryService";
import { AuthContext } from "../../context/AuthContext";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "./artistInquiriesModern.css";

function ArtistInquiries() {
  const { user } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const artistId = user?.userType === "artist" ? user.id : null;

  const fetchInquiries = async () => {
    if (!artistId) {
      setError("Artist login required.");
      setLoading(false);
      return;
    }

    try {
      const res = await inquiryService.getInquiriesByArtist(artistId);
      setInquiries(res.data || []);
    } catch {
      setError("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const respondToInquiry = async (id, status) => {
    try {
      await inquiryService.respondToInquiry(id, {
        status,
        responseMessage:
          status === "INTERESTED"
            ? "Yes, I am interested."
            : "Not available.",
      });
      fetchInquiries();
    } catch {
      alert("Failed to respond");
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [artistId]);

  if (loading) return <div className="modern-loading">Loading...</div>;

  return (
    <ArtistModuleLayout>
      <div className="modern-inquiries">

        {/* HERO */}
        <div className="modern-hero">
          <div>
            <span className="modern-tag">INQUIRIES</span>
            <h1>Your Event Requests</h1>
            <p>Manage and respond to incoming event inquiries.</p>
          </div>
        </div>

        {error && <div className="modern-error">{error}</div>}

        {/* EMPTY */}
        {inquiries.length === 0 ? (
          <div className="modern-empty">No inquiries found.</div>
        ) : (
          <div className="modern-grid">
            {inquiries.map((inq) => (
              <div key={inq.id} className="modern-card">

                <div className="modern-card-top">
                  <h3>{inq.eventName}</h3>
                  <span className={`status ${inq.status.toLowerCase()}`}>
                    {inq.status}
                  </span>
                </div>

                <p className="modern-meta">
                  📍 {inq.venue} · 🗓 {inq.eventDateTime}
                </p>

                {inq.organizerMessage && (
                  <div className="modern-message">
                    "{inq.organizerMessage}"
                  </div>
                )}

                {inq.responseMessage && (
                  <p className="modern-response">
                    Your response: {inq.responseMessage}
                  </p>
                )}

                {inq.status === "PENDING" && (
                  <div className="modern-actions">
                    <button
                      className="accept"
                      onClick={() =>
                        respondToInquiry(inq.id, "INTERESTED")
                      }
                    >
                      ✓ Accept
                    </button>

                    <button
                      className="reject"
                      onClick={() =>
                        respondToInquiry(inq.id, "NOT_INTERESTED")
                      }
                    >
                      ✕ Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ArtistModuleLayout>
  );
}

export default ArtistInquiries;