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
    console.log("Starting QR download for stall:", stall);
    
    try {
      if (!stall.qrCodeUrl) {
        alert("QR Code not available for this stall.");
        return;
      }

      // Use the dedicated QR endpoint instead of static file
      const qrUrl = `http://localhost:8080/api/stall-owner/${ownerId}/stalls/${stall.id}/qr`;
      console.log("Fetching QR from endpoint:", qrUrl);

      // Fetch image using axios with blob response type
      const response = await axios.get(qrUrl, {
        responseType: "blob",
      });
      console.log("QR image fetched successfully, blob size:", response.data.size);

      // Create PDF
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Stall QR Code", 105, 20, { align: "center" });

      autoTable(doc, {
        startY: 30,
        head: [["Field", "Details"]],
        body: [
          ["Business Name", stall.businessName || "N/A"],
          ["Product Type", stall.productType || "N/A"],
          ["Package Type", stall.packageType || "N/A"],
          ["Amount", `Rs. ${stall.amount || 0}`],
          ["Payment Status", stall.paymentStatus || "N/A"],
        ],
      });

      // Convert blob to base64 and add to PDF
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          console.log("Image converted to base64, adding to PDF...");
          const imgData = reader.result;
          const finalY = doc.lastAutoTable.finalY || 40;
          doc.addImage(imgData, "PNG", 60, finalY + 10, 90, 90);
          doc.save(`${stall.businessName || "Stall"}-QR.pdf`);
          console.log("PDF saved successfully!");
        } catch (pdfErr) {
          console.error("Error adding image to PDF:", pdfErr);
          // Fallback: download QR image directly
          downloadQRImageDirectly(response.data, stall.businessName);
        }
      };
      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        // Fallback: download QR image directly
        downloadQRImageDirectly(response.data, stall.businessName);
      };
      reader.readAsDataURL(response.data);

    } catch (err) {
      console.error("Failed to generate QR PDF:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        request: err.request
      });
      
      if (err.response) {
        alert(`Failed to load QR image: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        alert("No response from server. Please check if the backend is running on port 8080.");
      } else {
        alert("Failed to download QR. Error: " + err.message);
      }
    }
  };

  // Fallback function to download QR image directly
  const downloadQRImageDirectly = (blob, businessName) => {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${businessName || "Stall"}-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert("QR Code downloaded as image (PDF generation failed)");
    } catch (err) {
      console.error("Direct download failed:", err);
      alert("Failed to download QR code.");
    }
  };

  const deleteStall = async (stallId) => {
    if (!window.confirm("Are you sure you want to delete this stall registration?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/stall-owner/${ownerId}/stalls/${stallId}`
      );
      alert("Stall deleted successfully");
      fetchStalls();
    } catch (err) {
      console.error("Error deleting stall:", err);
      alert("Failed to delete stall. Please try again.");
    }
  };

  return (
    <div className="so-profile-scope">
      <button className="ssp-back-btn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="so-profile-container">
        <h2>My Stalls</h2>

        <button
          className="so-apply-btn"
          onClick={() => navigate("/")}
        >
          Browse Events & Apply for Stall
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
                    onClick={() => downloadQR(stall)}
                  >
                    Download QR as PDF
                  </button>
                </div>
              )}

              {/* Delete Button */}
              <button
                className="so-delete-btn"
                onClick={() => deleteStall(stall.id)}
              >
                Delete Stall
              </button>
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