import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StallPayment.css";

const StallPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, stallOwner, package: selectedPackage, totalAmount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!event || !stallOwner || !selectedPackage) {
    return (
      <div className="stall-payment-page">
        <div className="payment-error">
          <h2>Invalid Payment Session</h2>
          <p>Please go back and complete the stall application form.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert("Please fill in all card details");
        return;
      }
    }

    setProcessing(true);

    try {
      // Submit stall registration to backend
      const response = await axios.post("http://localhost:8080/api/stalls/register", {
        eventId: event.id,
        ownerName: stallOwner.ownerName,
        nicNumber: stallOwner.nicNumber,
        contactNumber: stallOwner.contactNumber,
        email: stallOwner.email,
        businessName: stallOwner.businessName,
        productType: stallOwner.productType,
        address: stallOwner.address || "",
        packageType: selectedPackage.name,
        amount: totalAmount,
        paymentMethod: paymentMethod
      });

      console.log("Registration successful:", response.data);
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Payment failed:", err);
      if (err.response) {
        // Server responded with error
        console.error("Error response:", err.response.data);
        alert(`Payment failed: ${err.response.data.message || err.response.statusText || "Server error"}`);
      } else if (err.request) {
        // No response from server
        alert("Cannot connect to server. Please make sure the backend is running on port 8080.");
      } else {
        alert("Payment failed. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="stall-payment-page">
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your stall registration has been confirmed.</p>
          
          <div className="success-details">
            <div className="detail-row">
              <span>Event:</span>
              <span>{event.eventName}</span>
            </div>
            <div className="detail-row">
              <span>Package:</span>
              <span>{selectedPackage.name}</span>
            </div>
            <div className="detail-row">
              <span>Amount Paid:</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span>Stall Owner:</span>
              <span>{stallOwner.ownerName}</span>
            </div>
          </div>

          <p className="confirmation-note">
            A confirmation email will be sent to <strong>{stallOwner.email}</strong>
          </p>

          <button className="home-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stall-payment-page">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      <div className="payment-container">
        <h1>💳 Complete Payment</h1>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span>Event</span>
              <span>{event.eventName}</span>
            </div>
            <div className="summary-item">
              <span>Package</span>
              <span className="package-badge">{selectedPackage.name}</span>
            </div>
            <div className="summary-item">
              <span>Stall Owner</span>
              <span>{stallOwner.ownerName}</span>
            </div>
            <div className="summary-item">
              <span>Business</span>
              <span>{stallOwner.businessName}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span>Total Amount</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h2>Select Payment Method</h2>
          
          <div className="method-options">
            <div 
              className={`method-card ${paymentMethod === "card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <span className="method-icon">💳</span>
              <span className="method-name">Credit/Debit Card</span>
            </div>
            
            <div 
              className={`method-card ${paymentMethod === "bank" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("bank")}
            >
              <span className="method-icon">🏦</span>
              <span className="method-name">Bank Transfer</span>
            </div>
            
            <div 
              className={`method-card ${paymentMethod === "cash" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("cash")}
            >
              <span className="method-icon">💵</span>
              <span className="method-name">Cash on Event Day</span>
            </div>
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === "card" && (
          <div className="card-details-form">
            <h2>Card Details</h2>
            <div className="card-form-grid">
              <div className="form-group full">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInput}
                  maxLength="19"
                />
              </div>
              <div className="form-group full">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Name on card"
                  value={cardDetails.cardHolder}
                  onChange={handleCardInput}
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={handleCardInput}
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="***"
                  value={cardDetails.cvv}
                  onChange={handleCardInput}
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Info */}
        {paymentMethod === "bank" && (
          <div className="bank-info">
            <h2>Bank Transfer Details</h2>
            <div className="bank-details">
              <p><strong>Bank:</strong> Bank of Ceylon</p>
              <p><strong>Account Name:</strong> Uni Festivo Events</p>
              <p><strong>Account Number:</strong> 1234567890</p>
              <p><strong>Branch:</strong> Colombo Main</p>
              <p className="bank-note">
                Please use your NIC number as the reference. 
                Upload the receipt after payment.
              </p>
            </div>
          </div>
        )}

        {/* Cash Payment Info */}
        {paymentMethod === "cash" && (
          <div className="cash-info">
            <h2>Cash Payment</h2>
            <p>You can pay cash at the event registration desk on the event day.</p>
            <p className="cash-note">
              ⚠️ Please arrive 30 minutes early to complete payment and setup.
            </p>
          </div>
        )}

        {/* Pay Button */}
        <button 
          className={`pay-btn ${processing ? "processing" : ""}`}
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>Processing...</>
          ) : (
            <>Pay Rs. {totalAmount.toLocaleString()}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default StallPayment;
