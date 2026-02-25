// src/pages/stallOwner/StallApplication.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StallApplication = () => {
  const { ownerId, eventId } = useParams();
  const navigate = useNavigate();
  const [stallData, setStallData] = useState({
    businessName: "",
    productType: "",
    packageType: "",
    amount: 0,
  });

  // Static three area options: Gold, Platinum, Silver
  const packages = [
    { name: "Gold", price: 5000 },
    { name: "Platinum", price: 8000 },
    { name: "Silver", price: 3000 },
  ];

  const handleSubmit = async () => {
    try {
      // Create stall with package/amount and details
      const payload = { ...stallData, eventId: Number(eventId) };
      const res = await axios.post(`http://localhost:8080/api/stall-owner/${ownerId}/stalls`, payload);
      navigate(`/stall-payment/${ownerId}/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create stall");
    }
  };

  return (
    <div>
      <h2>Apply for Stall</h2>
      <input
        placeholder="Business Name"
        value={stallData.businessName}
        onChange={e => setStallData({ ...stallData, businessName: e.target.value })}
      />
      <input
        placeholder="Product Type"
        value={stallData.productType}
        onChange={e => setStallData({ ...stallData, productType: e.target.value })}
      />

      <h3>Select Area / Package</h3>
      {packages.map(p => (
        <button
          key={p.name}
          onClick={() => setStallData({ ...stallData, packageType: p.name, amount: p.price })}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
            border: stallData.packageType === p.name ? "2px solid #00c8ff" : "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          {p.name} (Rs. {p.price})
        </button>
      ))}

      {stallData.packageType && (
        <p>Selected: {stallData.packageType} – Amount: Rs. {stallData.amount}</p>
      )}
      <button onClick={handleSubmit}>Next → Payment</button>
    </div>
  );
};

export default StallApplication;