// src/pages/stallOwner/StallApplication.jsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./StallRegister.css";

const StallApplication = () => {
  const { ownerId, eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [stallData, setStallData] = useState({
    businessName: "",
    productType: "",
    amount: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch owner details on component mount
  React.useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/stall-owner/${ownerId}/details`);
        console.log("Fetched owner details:", res.data);
        
        // Use data from location.state if available, otherwise use fetched data
        const stateData = location.state || {};
        
        setStallData({
          businessName: stateData.businessName || res.data.businessName || "",
          productType: stateData.productType || res.data.productType || "",
          amount: 0,
        });
      } catch (err) {
        console.error("Failed to fetch owner details:", err);
        alert("Failed to load owner details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOwnerDetails();
  }, [ownerId, location.state]);

  const packages = [
    {
      name: "Gold",
      price: 5000,
      color: "#FFD700",
      features: [
        "Prime location near entrance",
        "Large stall space (10x10)",
        "Free electricity connection",
        "1 Promotional banner space",
      ],
    },
    {
      name: "Platinum",
      price: 8000,
      color: "#00E5FF",
      features: [
        "Premium central location",
        "Extra large stall space (15x15)",
        "Free electricity + lighting",
        "2 Promotional banner spaces",
        "Social media promotion",
      ],
    },
    {
      name: "Silver",
      price: 3000,
      color: "#C0C0C0",
      features: [
        "Standard location",
        "Medium stall space (8x8)",
        "Shared electricity",
        "Basic listing in event guide",
      ],
    },
  ];

  const handleSubmit = async () => {
    if (!stallData.packageType) {
      alert("Please select a package");
      return;
    }

    try {
      const payload = { ...stallData, eventId: Number(eventId) };
      const res = await axios.post(
        `http://localhost:8080/api/stall-owner/${ownerId}/stalls`,
        payload
      );

      navigate(`/stall-payment/${ownerId}/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create stall");
    }
  };

  return (
    <div className="stall-app-container">
      <div className="stall-app-card">
        <h2>Apply for Stall</h2>

        {loading ? (
          <p>Loading your details...</p>
        ) : (
          <>
            <div className="input-group">
              <input
                placeholder="Business Name"
                value={stallData.businessName}
                onChange={(e) =>
                  setStallData({ ...stallData, businessName: e.target.value })
                }
              />
              <input
                placeholder="Product Type"
                value={stallData.productType}
                onChange={(e) =>
                  setStallData({ ...stallData, productType: e.target.value })
                }
              />
            </div>

            <h3>Select Package</h3>

            <div className="package-grid">
              {packages.map((p) => (
                <div
                  key={p.name}
                  className={`package-card ${
                    stallData.packageType === p.name ? "selected" : ""
                  }`}
                  style={{
                    borderColor: p.color,
                    background:
                      stallData.packageType === p.name
                        ? `${p.color}22`
                        : "rgba(255,255,255,0.05)",
                  }}
                  onClick={() =>
                    setStallData({
                      ...stallData,
                      packageType: p.name,
                      amount: p.price,
                    })
                  }
                >
                  <h4 style={{ color: p.color }}>{p.name}</h4>
                  <p className="price">Rs. {p.price}</p>

                  <ul>
                    {p.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {stallData.packageType && (
              <div className="selected-info">
                Selected: <strong>{stallData.packageType}</strong> – Rs.{" "}
                {stallData.amount}
              </div>
            )}

            <button
              className="next-btn"
              onClick={handleSubmit}
              disabled={!stallData.packageType}
            >
              Next → Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StallApplication;