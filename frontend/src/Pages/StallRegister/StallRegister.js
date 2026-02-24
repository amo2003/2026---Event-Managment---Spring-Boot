import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StallRegister.css";
import defaultImg from "../../assets/m4.jpg";

const StallRegister = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form data for stall owner identification
  const [formData, setFormData] = useState({
    ownerName: "",
    nicNumber: "",
    contactNumber: "",
    email: "",
    businessName: "",
    productType: "",
    address: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaySection, setShowPaySection] = useState(false);

  // Package options with pricing
  const packages = [
    { 
      id: "platinum", 
      name: "Platinum", 
      price: 15000, 
      color: "#E5E4E2",
      features: [
        "Premium front-row location",
        "10x10 ft stall space",
        "Electricity & lighting included",
        "2 chairs + 1 table provided",
        "Priority customer traffic",
        "Event banner display"
      ]
    },
    { 
      id: "gold", 
      name: "Gold", 
      price: 10000, 
      color: "#FFD700",
      features: [
        "Prime location",
        "8x8 ft stall space",
        "Electricity included",
        "1 chair + 1 table provided",
        "Good customer visibility"
      ]
    },
    { 
      id: "silver", 
      name: "Silver", 
      price: 5000, 
      color: "#C0C0C0",
      features: [
        "Standard location",
        "6x6 ft stall space",
        "Basic setup",
        "Affordable entry option"
      ]
    }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/public/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error loading event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const getEventImage = () => {
    if (event?.imageUrl) {
      return `http://localhost:8080/images/events/${event.imageUrl}`;
    }
    return defaultImg;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.ownerName.trim()) errors.ownerName = "Owner name is required";
    if (!formData.nicNumber.trim()) errors.nicNumber = "NIC number is required";
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.businessName.trim()) errors.businessName = "Business name is required";
    if (!formData.productType.trim()) errors.productType = "Product type is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePackageSelect = (pkg) => {
    if (!validateForm()) {
      alert("Please fill in all required fields first");
      return;
    }
    setSelectedPackage(pkg);
    setShowPaySection(true);
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price;
  };

  const handleProceedToPayment = () => {
    if (!selectedPackage) {
      alert("Please select a package");
      return;
    }

    // Navigate to payment page with all data
    navigate("/stall-payment", {
      state: {
        event: event,
        stallOwner: formData,
        package: selectedPackage,
        totalAmount: calculateTotal()
      }
    });
  };

  if (loading) {
    return (
      <div className="stall-page">
        <div className="stall-loading">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="stall-page">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <div className="stall-loading">Event not found.</div>
      </div>
    );
  }

  return (
    <div className="stall-page">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      {/* Event Details Section */}
      <div className="stall-event-header">
        <div className="stall-event-image">
          <img src={getEventImage()} alt={event.eventName} />
          <div className="stall-event-overlay">
            <span className="stall-badge">Stall Application</span>
          </div>
        </div>
        <div className="stall-event-info">
          <h1>{event.eventName}</h1>
          <p className="organized-by">Organized by: <strong>{event.societyName}</strong></p>
          <div className="event-meta-grid">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏰</span>
              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <span>{event.venue}</span>
            </div>
          </div>
          {event.description && (
            <p className="event-desc">{event.description}</p>
          )}
        </div>
      </div>

      {/* Stall Owner Form */}
      <div className="stall-form-section">
        <h2>📋 Stall Owner Details</h2>
        <p className="form-subtitle">Please fill in your details for identification</p>
        
        <div className="stall-form-grid">
          <div className="form-group">
            <label>Owner Name *</label>
            <input
              type="text"
              name="ownerName"
              placeholder="Enter your full name"
              value={formData.ownerName}
              onChange={handleInputChange}
              className={formErrors.ownerName ? "error" : ""}
            />
            {formErrors.ownerName && <span className="error-text">{formErrors.ownerName}</span>}
          </div>

          <div className="form-group">
            <label>NIC Number *</label>
            <input
              type="text"
              name="nicNumber"
              placeholder="Enter NIC number"
              value={formData.nicNumber}
              onChange={handleInputChange}
              className={formErrors.nicNumber ? "error" : ""}
            />
            {formErrors.nicNumber && <span className="error-text">{formErrors.nicNumber}</span>}
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter contact number"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={formErrors.contactNumber ? "error" : ""}
            />
            {formErrors.contactNumber && <span className="error-text">{formErrors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? "error" : ""}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Business / Shop Name *</label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleInputChange}
              className={formErrors.businessName ? "error" : ""}
            />
            {formErrors.businessName && <span className="error-text">{formErrors.businessName}</span>}
          </div>

          <div className="form-group">
            <label>Product Type *</label>
            <input
              type="text"
              name="productType"
              placeholder="What products will you sell?"
              value={formData.productType}
              onChange={handleInputChange}
              className={formErrors.productType ? "error" : ""}
            />
            {formErrors.productType && <span className="error-text">{formErrors.productType}</span>}
          </div>

          <div className="form-group full-width">
            <label>Address (Optional)</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your business address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Package Selection */}
      <div className="stall-packages-section">
        <h2>🎯 Select Your Stall Package</h2>
        <p className="form-subtitle">Choose the package that suits your needs</p>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`package-card ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
              onClick={() => handlePackageSelect(pkg)}
              style={{ "--package-color": pkg.color }}
            >
              <div className="package-header" style={{ background: pkg.color }}>
                <h3>{pkg.name}</h3>
                <div className="package-price">
                  <span className="currency">Rs.</span>
                  <span className="amount">{pkg.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="package-features">
                <ul>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <button className="select-package-btn">
                {selectedPackage?.id === pkg.id ? "✓ Selected" : "Select Package"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary - Shows after package selection */}
      {showPaySection && selectedPackage && (
        <div className="payment-summary-section">
          <h2>💳 Payment Summary</h2>
          
          <div className="summary-card">
            <div className="summary-row">
              <span>Event:</span>
              <span>{event.eventName}</span>
            </div>
            <div className="summary-row">
              <span>Package:</span>
              <span className="package-name">{selectedPackage.name}</span>
            </div>
            <div className="summary-row">
              <span>Stall Owner:</span>
              <span>{formData.ownerName}</span>
            </div>
            <div className="summary-row">
              <span>Business:</span>
              <span>{formData.businessName}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span className="total-amount">Rs. {calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          <button className="pay-now-btn" onClick={handleProceedToPayment}>
            Proceed to Payment →
          </button>
        </div>
      )}
    </div>
  );
};

export default StallRegister;
