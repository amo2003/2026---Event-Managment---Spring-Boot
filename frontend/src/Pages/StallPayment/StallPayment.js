// src/pages/stallOwner/StallPayment.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StallPayment.css";

const StallPayment = () => {
  const { ownerId, stallId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [stall, setStall] = useState(null);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch stall details
  useEffect(() => {
    const fetchStall = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/stall-owner/${ownerId}/stalls`
        );

        const s = res.data.find(
          (st) => String(st.id) === String(stallId)
        );

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

  // Format card number (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted;
  };

  // Format expiry (MM/YY)
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  };

  // Handle Card Payment
  const handleCardPayment = async () => {
    if (loading) return; // prevent double click

    if (!card.number || !card.expiry || !card.cvv) {
      alert("Please enter card number, expiry and CVV");
      return;
    }

    if (card.number.replace(/\s/g, "").length !== 16) {
      alert("Card number must be 16 digits");
      return;
    }

    if (card.cvv.length < 3) {
      alert("Invalid CVV");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:8080/api/stall-owner/${ownerId}/pay-card`,
        {
          stallId,
          amount,
        }
      );

      alert("Payment Successful! Stall scheduled.");
      navigate(`/owner-profile/${ownerId}`);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Slip Upload
  const handleSlipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("slip", file);
    formData.append("stallId", stallId);
    if (note) formData.append("note", note);

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stall-payment-container">
      <button className="stp-back-btn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="stall-payment-card">
        <h2>Stall Payment</h2>

        <div className="stall-summary">
          <p><strong>Business:</strong> {stall?.businessName || "-"}</p>
          <p><strong>Package:</strong> {stall?.packageType || "-"}</p>
          <p><strong>Amount:</strong> Rs. {amount || "-"}</p>
        </div>

        <div className="payment-section">
          <h3>Pay by Card</h3>

          <input
            placeholder="Card Number"
            value={card.number}
            onChange={(e) =>
              setCard({
                ...card,
                number: formatCardNumber(e.target.value),
              })
            }
          />

          <input
            placeholder="Expiry MM/YY"
            value={card.expiry}
            onChange={(e) =>
              setCard({
                ...card,
                expiry: formatExpiry(e.target.value),
              })
            }
          />

          <input
            placeholder="CVV"
            type="password"
            maxLength={3}
            value={card.cvv}
            onChange={(e) =>
              setCard({
                ...card,
                cvv: e.target.value.replace(/\D/g, ""),
              })
            }
          />

          <button
            className="pay-btn"
            onClick={handleCardPayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <div className="divider">OR</div>

        <div className="payment-section">
          <h3>Upload Bank Slip</h3>

          <textarea
            placeholder="Enter any details about this payment (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <input
            type="file"
            onChange={handleSlipUpload}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default StallPayment;