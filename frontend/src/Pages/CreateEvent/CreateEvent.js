// src/pages/CreateEvent.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventName: "",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    contactNumber: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const venues = [
    "Main Auditorium",
    "SLIIT - දූපත්",
    "Open Air Theater",
    "Main Ground",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.eventName || !form.venue || !form.eventDate || !form.startTime || !form.endTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      data.append("societyId", user.id);
      if (image) data.append("image", image);

      await axios.post("http://localhost:8080/api/society/events/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event Submitted! Waiting for Admin Approval.");

      setForm({
        eventName: "",
        venue: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        contactNumber: "",
        description: "",
      });

      setImage(null);
      setPreview(null);

      navigate("/my-events");
    } catch (err) {
      console.error(err);
      alert("Error submitting event. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="event-create-scope">
      <div className="event-create-container">
        <h2 className="event-create-title">Apply to Conduct Event</h2>

        <form className="event-create-form" onSubmit={handleSubmit}>
          
          <input
            className="event-input"
            placeholder="Event Name"
            value={form.eventName}
            onChange={(e) => setForm({ ...form, eventName: e.target.value })}
          />

          {/* Venue Dropdown */}
          <select
            className="event-input event-select"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          >
            <option value="">Select Venue</option>
            {venues.map((v, index) => (
              <option key={index} value={v}>
                {v}
              </option>
            ))}
          </select>

          <input
            className="event-input"
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          />

          <input
            className="event-input"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />

          <input
            className="event-input"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />

          <input
            className="event-input"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          />

          <textarea
            className="event-textarea"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Image Upload Section */}
          <div className="image-upload-wrapper">
            <label className="custom-file-upload">
              Upload Event Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <button className="event-submit-btn" type="submit">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;