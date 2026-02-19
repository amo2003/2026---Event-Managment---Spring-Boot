// src/pages/CreateEvent.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // import navigate
import "./CreateEvent.css";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // initialize navigation

  const [form, setForm] = useState({
    eventName: "",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!form.eventName || !form.venue || !form.eventDate || !form.startTime || !form.endTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/society/events/create", {
        ...form,
        societyId: user.id
      });

      alert("Event Submitted! Waiting for Admin Approval.");

      // Reset form
      setForm({
        eventName: "",
        venue: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        description: ""
      });

      // Navigate to "My Event Requests" page
      navigate("/my-events");
    } catch (err) {
      console.error(err);
      alert("Error submitting event. Please try again.");
    }
  };

  return (
    <div className="event-form-page">
      <h2>Apply to Conduct Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Event Name"
          value={form.eventName}
          onChange={(e) => setForm({ ...form, eventName: e.target.value })}
          required
        />

        <input
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
          required
        />

        <input
          type="date"
          value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          required
        />

        <input
          type="time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
        />

        <input
          type="time"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default CreateEvent;
