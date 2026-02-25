// src/pages/stallOwner/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StallOwnerProfile = () => {
  const { ownerId } = useParams();
  const [stalls, setStalls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStalls = async () => {
      const res = await axios.get(`http://localhost:8080/api/stall-owner/${ownerId}/stalls`);
      setStalls(res.data);
    };
    fetchStalls();
  }, [ownerId]);

  return (
    <div>
      <h2>My Stalls</h2>
      <button onClick={() => navigate("/events")}>Apply for Stall</button>
      {stalls.map(stall => (
        <div key={stall.id}>
          <h3>{stall.businessName} - {stall.area}</h3>
          <p>Payment: {stall.paymentStatus} ({stall.paymentMethod})</p>
        </div>
      ))}
    </div>
  );
};

export default StallOwnerProfile;