import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddSociety.css";

function AddSociety() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/society-list", {
        name,
      });

      setMessage("Society Added Successfully!");

      setTimeout(() => {
        navigate("/register"); // go back
      }, 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding society");
    }
  };

  return (
    <div className="add-page">
      <div className="add-container">
        <h2>Add Your Society</h2>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Society Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit">Add Society</button>
        </form>
      </div>
    </div>
  );
}

export default AddSociety;