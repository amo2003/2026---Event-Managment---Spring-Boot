// src/pages/stallOwner/StallPayment.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StallPayment = () => {
  const { ownerId, stallId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");

  const handleCardPayment = async () => {
    try {
      await axios.post(`http://localhost:8080/api/stall-owner/${ownerId}/pay-card`, { stallId, amount });
      alert("Payment Successful! Stall scheduled.");
      navigate(`/owner-profile/${ownerId}`);
    } catch (err) { console.error(err); alert("Payment failed"); }
  };

  const handleSlipUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("slip", file);
    formData.append("stallId", stallId);
    try {
      await axios.post(`http://localhost:8080/api/stall-owner/${ownerId}/upload-slip`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Slip uploaded! Waiting for admin approval.");
      navigate(`/owner-profile/${ownerId}`);
    } catch (err) { console.error(err); alert("Upload failed"); }
  };

  return (
    <div>
      <h2>Payment</h2>
      <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <div>
        <button onClick={handleCardPayment}>Pay by Card</button>
        <input type="file" onChange={handleSlipUpload} />
      </div>
    </div>
  );
};

export default StallPayment;