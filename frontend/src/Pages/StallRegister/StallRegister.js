// src/pages/stallOwner/StallApplication.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StallApplication = () => {
  const { ownerId, eventId } = useParams();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [stallData, setStallData] = useState({ businessName: "", productType: "", packageType: "", area: "", amount: 0 });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/stalls/areas/${eventId}`)
      .then(res => setAreas(res.data));
  }, [eventId]);

  const handleSubmit = async () => {
    try {
      // Create stall with area selection
      const payload = { ...stallData, eventId };
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
      <input placeholder="Business Name" value={stallData.businessName} onChange={e => setStallData({...stallData, businessName: e.target.value})} />
      <input placeholder="Product Type" value={stallData.productType} onChange={e => setStallData({...stallData, productType: e.target.value})} />
      <select value={stallData.area} onChange={e => setStallData({...stallData, area: e.target.value})}>
        <option value="">Select Area</option>
        {areas.map(a => <option key={a.id} value={a.name}>{a.name} - ${a.price}</option>)}
      </select>
      <button onClick={handleSubmit}>Next → Payment</button>
    </div>
  );
};

export default StallApplication;