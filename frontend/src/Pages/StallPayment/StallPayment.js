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
  const [payHereConfig, setPayHereConfig] = useState(null);

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

  // Fetch PayHere configuration
  useEffect(() => {
    const fetchPayHereConfig = async () => {
      try {
        console.log("Fetching PayHere config...");
        const res = await axios.get(
          "http://localhost:8080/api/stall-owner/payhere-config"
        );
        console.log("PayHere config received:", res.data);
        setPayHereConfig(res.data);
      } catch (err) {
        console.error("Failed to load PayHere config:", err);
        console.error("Error details:", err.response);
        alert("Failed to load PayHere configuration. Please check if backend is running.");
      }
    };

    fetchPayHereConfig();
  }, []);

  // Load PayHere script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    if (loading) return;

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

  // Handle PayHere Payment
  const handlePayHerePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Invalid amount");
      return;
    }

    if (!window.payhere) {
      alert("PayHere is not loaded. Please refresh the page.");
      return;
    }

    // Use config from backend or fallback to defaults
    const config = payHereConfig || {
      merchantId: "1227569",
      sandbox: true,
      currency: "LKR"
    };

    if (!payHereConfig) {
      console.warn("Using default PayHere configuration");
    }

    try {
      const orderId = `STALL_${stallId}_${Date.now()}`;
      const formattedAmount = parseFloat(amount).toFixed(2);

      // Generate hash from backend
      console.log("Generating PayHere hash...");
      const hashResponse = await axios.post(
        "http://localhost:8080/api/stall-owner/payhere-hash",
        {
          order_id: orderId,
          amount: formattedAmount,
          currency: config.currency
        }
      );

      const hash = hashResponse.data.hash;
      console.log("Hash generated:", hash);

      // PayHere payment object
      const payment = {
        sandbox: true,
        merchant_id: config.merchantId,
        return_url: window.location.origin + `/owner-profile/${ownerId}`,
        cancel_url: window.location.origin + `/stall-payment/${ownerId}/${stallId}`,
        notify_url: "http://sample.com/notify",
        order_id: orderId,
        items: "Stall Registration",
        amount: formattedAmount,
        currency: config.currency,
        hash: hash, // Add the hash
        first_name: "Test",
        last_name: "Customer",
        email: "test@example.com",
        phone: "0771234567",
        address: "No.1, Galle Road",
        city: "Colombo",
        country: "Sri Lanka",
      };

      console.log("PayHere Payment Config:", payment);

      // PayHere callbacks
      window.payhere.onCompleted = async function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        
        try {
          // Call backend to mark payment as completed
          await axios.post(
            `http://localhost:8080/api/stall-owner/${ownerId}/pay-payhere`,
            {
              stallId,
              amount,
              orderId,
            }
          );

          alert("Payment Successful! Stall scheduled.");
          navigate(`/owner-profile/${ownerId}`);
        } catch (err) {
          console.error("Error updating payment:", err);
          alert("Payment completed but failed to update. Please contact support.");
        }
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        console.log("PayHere Error:", error);
        
        let errorMessage = "Payment error occurred.";
        
        if (error && error.toLowerCase().includes("unauthorized")) {
          errorMessage = "Payment Unauthorized!\n\n" +
                        "Please check:\n" +
                        "1. Verify your email in PayHere sandbox\n" +
                        "2. Add 'http://localhost:3000' to PayHere allowed domains\n" +
                        "3. Verify your Merchant ID and Secret\n" +
                        "4. Restart the backend server\n\n" +
                        "See PAYHERE_UNAUTHORIZED_FIX.md for detailed instructions.";
        }
        
        alert(errorMessage);
      };

      window.payhere.startPayment(payment);
    } catch (err) {
      console.error("Error preparing payment:", err);
      alert("Failed to prepare payment. Please try again.");
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

        {/* PayHere Payment Section */}
        <div className="payment-section payhere-section">
          <h3>💳 Pay via PayHere</h3>
          <p className="payment-desc">Secure online payment gateway (Sandbox Mode)</p>
          <p className="payment-desc" style={{fontSize: '11px', color: 'rgba(0,0,0,0.6)'}}>
            Merchant ID: {payHereConfig?.merchantId || 'Loading...'}
          </p>
          <button
            className="pay-btn payhere-btn"
            onClick={handlePayHerePayment}
            disabled={loading}
          >
            Pay with PayHere
          </button>
        </div>

        <div className="divider">OR</div>

        {/* Card Payment Section */}
        <div className="payment-section">
          <h3>💳 Pay by Card</h3>

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

        {/* Slip Upload Section */}
        <div className="payment-section">
          <h3>📄 Upload Bank Slip</h3>

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