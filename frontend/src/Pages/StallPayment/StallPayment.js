// src/pages/stallOwner/StallPayment.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StallPayment = () => {
  const { ownerId, stallId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [stall, setStall] = useState(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [note, setNote] = useState("");

  // Auto-fetch stall to get amount from register page
  useEffect(() => {
    const fetchStall = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/stall-owner/${ownerId}/stalls`
        );
        const s = res.data.find((st) => String(st.id) === String(stallId));
        if (s) {
          setStall(s);
          if (s.amount != null) setAmount(String(s.amount));
        }
      } catch (err) {
        console.error("Failed to load stall", err);
      }
    };
    fetchStall();
  }, [ownerId, stallId]);

  const handleCardPayment = async () => {
    if (!card.number || !card.expiry || !card.cvv) {
      alert("Please enter card number, expiry and CVV");
      return;
    }
    try {
      await axios.post(`http://localhost:8080/api/stall-owner/${ownerId}/pay-card`, {
        stallId,
        amount,
      });
      alert("Payment Successful! Stall scheduled.");
      navigate(`/owner-profile/${ownerId}`);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const handleSlipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("slip", file);
    formData.append("stallId", stallId);
    if (note) formData.append("note", note);
    try {
      await axios.post(
        `http://localhost:8080/api/stall-owner/${ownerId}/upload-slip`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Slip uploaded! Waiting for admin approval.");
      navigate(`/owner-profile/${ownerId}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Payment</h2>

      {/* Show auto-fetched amount and basic info */}
      <p>
        <strong>Business:</strong> {stall?.businessName || "-"}
      </p>
      <p>
        <strong>Package:</strong> {stall?.packageType || "-"}
      </p>
      <p>
        <strong>Amount:</strong> Rs. {amount || "-"}
      </p>

      <h3>1) Pay by Card</h3>
      <input
        placeholder="Card Number"
        value={card.number}
        onChange={(e) => setCard({ ...card, number: e.target.value })}
      />
      <input
        placeholder="Expiry MM/YY"
        value={card.expiry}
        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
      />
      <input
        placeholder="CVV"
        value={card.cvv}
        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
      />
      <button onClick={handleCardPayment}>Pay by Card</button>

      <h3>2) Or Upload Bank Slip</h3>
      <textarea
        placeholder="Enter any details about this payment (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input type="file" onChange={handleSlipUpload} />
    </div>
  );
};

export default StallPayment;