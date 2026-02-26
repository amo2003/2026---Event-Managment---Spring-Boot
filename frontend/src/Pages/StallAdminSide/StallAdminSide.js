import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./StallAdminSide.css";

const PendingPayments = () => {
  const [stalls, setStalls] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const fetchStalls = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stalls");
      setStalls(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  }, []);

  const approve = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/approve-payment/${id}`);
      fetchStalls();
    } catch (err) {
      console.error("Error approving payment:", err);
    }
  };

  const reject = async (id) => {
    const note = prompt("Enter rejection reason:");
    if (!note) return;

    try {
      await axios.put(
        `http://localhost:8080/api/admin/reject-payment/${id}?note=${encodeURIComponent(note)}`
      );
      fetchStalls();
    } catch (err) {
      console.error("Error rejecting payment:", err);
    }
  };

  useEffect(() => {
    fetchStalls();

    // Auto-reload every 5 seconds
    const interval = setInterval(fetchStalls, 5000);
    return () => clearInterval(interval);
  }, [fetchStalls]);

  return (
    <div className="pending-payments-scope">
      <div className="pending-payments-container">
        <h2>Stall Payments</h2>

        {stalls.length === 0 ? (
          <p className="no-stalls">No stalls found</p>
        ) : (
          <table className="pending-payments-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Payment Method</th>
                <th>Slip</th>
                <th>Note</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stalls.map((stall) => (
                <tr key={stall.id}>
                  <td>{stall.businessName}</td>
                  <td>{stall.owner?.ownerName || "-"}</td>
                  <td>{stall.paymentMethod || "-"}</td>
                  <td>
                    {stall.slipUrl ? (
                      <img
                        src={`http://localhost:8080${stall.slipUrl}`}
                        alt="Payment Slip"
                        className="slip-img"
                        onClick={() =>
                          setModalImage(`http://localhost:8080${stall.slipUrl}`)
                        }
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{stall.slipNote || "-"}</td>
                  <td className={`status-${stall.paymentStatus?.toLowerCase()}`}>
                    {stall.paymentStatus}
                  </td>
                  <td>
                    {stall.paymentStatus === "PENDING" ? (
                      <>
                        <button onClick={() => approve(stall.id)}>Approve</button>
                        <button onClick={() => reject(stall.id)}>Reject</button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modalImage && (
          <div className="slip-modal" onClick={() => setModalImage(null)}>
            <img src={modalImage} alt="Slip Preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayments;