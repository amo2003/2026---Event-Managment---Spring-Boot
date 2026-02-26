// src/pages/stallOwner/Profile.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./StallOwnerProfile.css";

const StallOwnerProfile = () => {
  const { ownerId } = useParams();
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  // Fetch stalls
  const fetchStalls = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/stall-owner/${ownerId}/stalls`
      );
      setStalls(res.data);
    } catch (err) {
      console.error("Error fetching stalls:", err);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchStalls();

    const interval = setInterval(fetchStalls, 5000);
    return () => clearInterval(interval);
  }, [fetchStalls]);

  const downloadQR = async (stall) => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Stall QR Code", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Business Name", stall.businessName],
        ["Product Type", stall.productType],
        ["Package Type", stall.packageType],
        ["Amount", `Rs. ${stall.amount}`],
        ["Payment Status", stall.paymentStatus],
      ],
    });

    const qrUrl =
      stall.qrCodeUrl.startsWith("/")
        ? `http://localhost:8080${stall.qrCodeUrl}`
        : stall.qrCodeUrl;

    // Create image
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = qrUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/png");

      const finalY = doc.lastAutoTable.finalY || 40;
      doc.addImage(imgData, "PNG", 60, finalY + 10, 90, 90);

      doc.save(`${stall.businessName}-QR.pdf`);
    };

    img.onerror = () => {
      alert("Failed to load QR image.");
    };

  } catch (err) {
    console.error("Failed to generate QR PDF:", err);
    alert("Failed to download QR PDF.");
  }
};

  return (
    <div className="so-profile-scope">
      <div className="so-profile-container">
        <h2>My Stalls</h2>

        <button
          className="so-apply-btn"
          onClick={() => navigate("/events")}
        >
          Apply for Stall
        </button>

        {loading && <p className="so-status-text">Loading stalls...</p>}

        {!loading && stalls.length === 0 && (
          <p className="so-status-text">No stalls registered yet.</p>
        )}

        <div className="so-stalls-grid">
          {stalls.map((stall) => (
            <div key={stall.id} className="so-stall-card">
              <h3>{stall.businessName}</h3>
              <p><strong>Product:</strong> {stall.productType}</p>
              <p><strong>Package:</strong> {stall.packageType}</p>
              <p><strong>Amount:</strong> Rs. {stall.amount}</p>
              <p>
                <strong>Payment:</strong> {stall.paymentStatus}
                {stall.paymentMethod
                  ? ` (${stall.paymentMethod})`
                  : ""}
              </p>

              {/* Payment Slip */}
              {stall.slipUrl && (
                <div className="so-slip-section">
                  <strong>Payment Slip:</strong>
                  <img
                    src={`http://localhost:8080${stall.slipUrl}`}
                    alt="Payment Slip"
                    className="so-slip-img"
                    onClick={() =>
                      setModalImage(`http://localhost:8080${stall.slipUrl}`)
                    }
                  />
                </div>
              )}

              {/* QR Section */}
              {stall.paymentStatus === "APPROVED" && stall.qrCodeUrl && (
                <div className="so-qr-section">
                  <strong>Stall QR Code:</strong>
                  <img
                    src={`http://localhost:8080${stall.qrCodeUrl}`}
                    alt="Stall QR Code"
                    className="so-qr-img"
                  />
                  <button
  className="so-download-btn"
  onClick={() => downloadQR(stall)} // ✅ pass full stall object
>
  Download QR as PDF
</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalImage && (
        <div
          className="so-slip-modal"
          onClick={() => setModalImage(null)}
        >
          <img src={modalImage} alt="Slip Preview" />
        </div>
      )}
    </div>
  );
};

export default StallOwnerProfile;