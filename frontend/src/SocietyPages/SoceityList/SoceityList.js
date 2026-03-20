import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SoceityList.css";

const SoceityList = () => {
  const [societies, setSocieties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/society/all")
      .then((res) => setSocieties(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="all-societies-page">
      <h1>All Registered Societies</h1>
      <div className="societies-grid">
        {societies.map((society) => (
          <div key={society.id} className="society-card">
            <h3>{society.name}</h3>
            <p><strong>Faculty:</strong> {society.faculty}</p>
            <p><strong>President:</strong> {society.presidentName}</p>
            <p><strong>Email:</strong> {society.email}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SoceityList;
