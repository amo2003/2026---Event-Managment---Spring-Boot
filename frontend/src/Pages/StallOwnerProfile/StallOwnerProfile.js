// src/pages/stallOwner/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./StallOwnerProfile.css"; // Added dedicated CSS

const StallOwnerProfile = () => {
  const { ownerId } = useParams();
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  // Fetch all stalls for this owner
  const fetchStalls = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/stall-owner/${ownerId}/stalls`);
      setStalls(res.data);
    } catch (err) {
      console.error("Error fetching stalls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStalls();
  }, [ownerId]);

  return (
    <div className="profile-scope">
      <div className="profile-container">
        <h2>My Stalls</h2>

        <button className="apply-btn" onClick={() => navigate("/events")}>
          Apply for Stall
        </button>

        {loading && <p className="status-text">Loading stalls...</p>}
        {!loading && stalls.length === 0 && (
          <p className="status-text">No stalls registered yet.</p>
        )}

        <div className="stalls-grid">
          {stalls.map((stall) => (
            <div key={stall.id} className="stall-card">
              <h3>{stall.businessName}</h3>
              <p><strong>Product:</strong> {stall.productType}</p>
              <p><strong>Package:</strong> {stall.packageType}</p>
              <p><strong>Amount:</strong> Rs. {stall.amount}</p>
              <p>
                <strong>Payment:</strong> {stall.paymentStatus} 
                {stall.paymentMethod ? ` (${stall.paymentMethod})` : ""}
              </p>

              {stall.slipUrl && (
                <div className="slip-section">
                  <strong>Payment Slip:</strong>
                  <img
                    src={`http://localhost:8080${stall.slipUrl}`}
                    alt="Payment Slip"
                    className="slip-img"
                    onClick={() => setModalImage(`http://localhost:8080${stall.slipUrl}`)}
                  />
                </div>
              )}

              {stall.qrCodeUrl && (
                <div className="qr-section">
                  <strong>Stall QR Code:</strong>
                  <img
                    src={`http://localhost:8080${stall.qrCodeUrl}`}
                    alt="Stall QR Code"
                    className="qr-img"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slip Modal */}
      {modalImage && (
        <div className="slip-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Slip Preview" />
        </div>
      )}
    </div>
  );
};

export default StallOwnerProfile;