import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventName: "", venue: "", eventDate: "",
    startTime: "", endTime: "", contactNumber: "", description: "",
  });

  const [artists, setArtists] = useState([""]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const venues = [
    "Main Auditorium",
    "SLIIT - දූපත්",
    "Open Air Theater",
    "Main Ground",
  ];

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split("T")[0];
  };

  const handleChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setErrors(prev => ({ ...prev, contactNumber: "" }));
    setForm(prev => ({ ...prev, contactNumber: value }));
  };

  const handleArtistChange = (index, value) => {
    const updated = [...artists];
    updated[index] = value.replace(/[0-9]/g, ""); // no numbers
    setArtists(updated);
    setErrors(prev => ({ ...prev, artists: "" }));
  };

  const addArtist = () => setArtists(prev => [...prev, ""]);

  const removeArtist = (index) => {
    if (artists.length === 1) return; // keep at least one
    setArtists(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescChange = (e) => {
    const value = e.target.value;
    if (value.length > 200) return;
    setErrors(prev => ({ ...prev, description: "" }));
    setForm(prev => ({ ...prev, description: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.eventName.trim())     e.eventName     = "Event name is required.";
    if (!form.venue)                e.venue         = "Please select a venue.";
    if (!form.eventDate)            e.eventDate     = "Event date is required.";
    if (!form.startTime)            e.startTime     = "Start time is required.";
    if (!form.endTime)              e.endTime       = "End time is required.";
    else if (form.startTime && form.endTime <= form.startTime)
                                    e.endTime       = "End time must be after start time.";
    if (!form.contactNumber.trim()) e.contactNumber = "Contact number is required.";
    else if (form.contactNumber.length !== 10)
                                    e.contactNumber = "Contact number must be exactly 10 digits.";
    const filledArtists = artists.filter(a => a.trim());
    if (filledArtists.length === 0) e.artists = "At least one artist is required.";
    if (!form.description.trim())   e.description   = "Description is required.";
    if (!image)                      e.image         = "Please upload a feature image.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      data.append("artists", artists.filter(a => a.trim()).join(", "));
      data.append("societyId", user.id);
      if (image) data.append("image", image);

      await axios.post("http://localhost:8080/api/society/events/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event Submitted! Waiting for Admin Approval.");
      setForm({ eventName: "", venue: "", eventDate: "", startTime: "", endTime: "", contactNumber: "", description: "" });
      setArtists([""]);
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
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const FE = ({ name }) => errors[name]
    ? <span className="ce-field-error">{errors[name]}</span>
    : null;

  return (
    <div className="event-create-scope">
      <div className="event-create-container">
        <h2 className="event-create-title">Apply to Conduct Event</h2>

        <form className="event-create-form" onSubmit={handleSubmit}>

          <div className="ce-field">
            <input className="event-input" placeholder="Event Name"
              value={form.eventName}
              onChange={(e) => handleChange("eventName", e.target.value)} />
            <FE name="eventName" />
          </div>

          <div className="ce-field">
            <select className="event-input event-select" value={form.venue}
              onChange={(e) => handleChange("venue", e.target.value)}>
              <option value="">Select Venue</option>
              {venues.map((v, i) => <option key={i} value={v}>{v}</option>)}
            </select>
            <FE name="venue" />
          </div>

          <div className="ce-field">
            <input className="event-input" type="date" value={form.eventDate}
              min={getMinDate()}
              onChange={(e) => handleChange("eventDate", e.target.value)} />
            <FE name="eventDate" />
          </div>

          <div className="ce-field">
            <input className="event-input" type="time" value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)} />
            <FE name="startTime" />
          </div>

          <div className="ce-field">
            <input className="event-input" type="time" value={form.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)} />
            <FE name="endTime" />
          </div>

          <div className="ce-field">
            <input className="event-input" placeholder="Contact Number"
              value={form.contactNumber} onChange={handleContactChange} />
            <FE name="contactNumber" />
          </div>

          {/* Artists */}
          <div className="ce-field">
            <div className="ce-artists-list">
              {artists.map((artist, index) => (
                <div key={index} className="ce-artist-row">
                  <input
                    className="event-input ce-artist-input"
                    placeholder={`Artist ${index + 1} name`}
                    value={artist}
                    onChange={(e) => handleArtistChange(index, e.target.value)}
                  />
                  {artists.length > 1 && (
                    <button type="button" className="ce-artist-remove" onClick={() => removeArtist(index)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="ce-artist-add" onClick={addArtist}>+ Add Artist</button>
            </div>
            <FE name="artists" />
          </div>

          <div className="ce-field">
            <textarea className="event-textarea" placeholder="Description (max 200 characters)"
              value={form.description} onChange={handleDescChange} />
            <div className="ce-desc-footer">
              <FE name="description" />
              <span className={`ce-char-count ${form.description.length >= 190 ? "ce-char-warn" : ""}`}>
                {form.description.length}/200
              </span>
            </div>
          </div>

          <div className="image-upload-wrapper">
            <label className="custom-file-upload">
              Upload Event Feature Image
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {errors.image && <span className="ce-field-error" style={{display:"block", marginTop:"6px"}}>{errors.image}</span>}
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
