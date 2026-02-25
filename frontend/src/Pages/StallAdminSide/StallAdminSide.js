// src/pages/admin/PendingPayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingPayments = () => {
  const [stalls, setStalls] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:8080/api/admin/pending-payments");
    setStalls(res.data);
  };

  const approve = async (id) => {
    await axios.put(`http://localhost:8080/api/admin/approve-payment/${id}`);
    fetchPending();
  };

  const reject = async (id) => {
    await axios.put(`http://localhost:8080/api/admin/reject-payment/${id}`);
    fetchPending();
  };

  useEffect(() => { fetchPending(); }, []);

  return (
    <div>
      <h2>Pending Payments</h2>
      {stalls.map(stall => (
        <div key={stall.id}>
          <p>{stall.businessName} ({stall.owner.name}) - {stall.paymentMethod}</p>
          <button onClick={() => approve(stall.id)}>Approve</button>
          <button onClick={() => reject(stall.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default PendingPayments;