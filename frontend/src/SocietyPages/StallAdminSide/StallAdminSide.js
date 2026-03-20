import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./StallAdminSide.css";
import { useNavigate } from "react-router-dom";

const PendingPayments = () => {
  const [stalls, setStalls] = useState([]);
  const [filteredStalls, setFilteredStalls] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch stalls
  const fetchStalls = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stalls");
      setStalls(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  }, []);

  // Approve payment
  const approve = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/approve-payment/${id}`);
      fetchStalls();
    } catch (err) {
      console.error("Error approving payment:", err);
    }
  };

  // Reject payment
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

  // Handle search input (only updates state)
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filter stalls whenever stalls or searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStalls(stalls);
      return;
    }

    const searchLower = searchTerm.toLowerCase();

    const filtered = stalls.filter((stall) => {
      const paymentMethod = (stall.paymentMethod || "").toLowerCase();
      const businessName = (stall.businessName || "").toLowerCase();
      const ownerName = (stall.owner?.ownerName || "").toLowerCase();
      const status = (stall.paymentStatus || "").toLowerCase();

      return (
        paymentMethod.includes(searchLower) ||
        businessName.includes(searchLower) ||
        ownerName.includes(searchLower) ||
        status.includes(searchLower)
      );
    });

    setFilteredStalls(filtered);
  }, [stalls, searchTerm]);

  // Initial fetch + auto reload
  useEffect(() => {
    fetchStalls();
    const interval = setInterval(fetchStalls, 5000);
    return () => clearInterval(interval);
  }, [fetchStalls]);

  // Filter by payment method buttons
  const filterByPaymentMethod = (method) => {
    if (method === "ALL") {
      setSearchTerm("");
    } else {
      setSearchTerm(method);
    }
  };

  return (
    <div className="pending-payments-scope">
      <button className="ad-back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="pending-payments-container">
        <h2>Stall Payments</h2>

        {/* Search + Filters */}
        <div className="search-filter-section">
          <input
            type="text"
            placeholder="Search by payment method, business name, owner, or status..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />

          <div className="filter-buttons">
            <button
              className={searchTerm === "" ? "filter-btn active" : "filter-btn"}
              onClick={() => filterByPaymentMethod("ALL")}
            >
              All
            </button>

            <button
              className={searchTerm === "CARD" ? "filter-btn active" : "filter-btn"}
              onClick={() => filterByPaymentMethod("CARD")}
            >
              Card
            </button>

            <button
              className={searchTerm === "SLIP" ? "filter-btn active" : "filter-btn"}
              onClick={() => filterByPaymentMethod("SLIP")}
            >
              Slip
            </button>
          </div>
        </div>

        <p className="stall-count">
          Showing {filteredStalls.length} of {stalls.length} stalls
        </p>

        {filteredStalls.length === 0 ? (
          <p className="no-stalls">No stalls found</p>
        ) : (
          <table className="pending-payments-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Slip</th>
                <th>Note</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStalls.map((stall) => (
                <tr key={stall.id}>
                  <td>{stall.businessName}</td>
                  <td>{stall.owner?.ownerName || "-"}</td>
                  <td>{stall.packageType || "-"}</td>

                  <td className="amount-cell">
                    <span className="amount-value">
                      Rs. {stall.amount ? stall.amount.toLocaleString() : "0"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`payment-method-badge ${stall.paymentMethod?.toLowerCase()}`}
                    >
                      {stall.paymentMethod || "-"}
                    </span>
                  </td>

                  <td>
                    {stall.slipUrl ? (
                      <img
                        src={`http://localhost:8080${stall.slipUrl}`}
                        alt="Payment Slip"
                        className="slip-img"
                        onClick={() =>
                          setModalImage(
                            `http://localhost:8080${stall.slipUrl}`
                          )
                        }
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{stall.slipNote || "-"}</td>

                  <td
                    className={`status-${stall.paymentStatus?.toLowerCase()}`}
                  >
                    {stall.paymentStatus}
                  </td>

                  <td>
                    {stall.paymentStatus === "PENDING" ? (
                      <>
                        <button onClick={() => approve(stall.id)}>
                          Approve
                        </button>
                        <button onClick={() => reject(stall.id)}>
                          Reject
                        </button>
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

        {/* Image Modal */}
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