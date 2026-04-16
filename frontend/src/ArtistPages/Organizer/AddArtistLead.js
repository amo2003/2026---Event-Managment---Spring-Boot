import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import artistLeadService from "../../services/artistLeadService";
import artistService from "../../services/artistService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

const CATEGORY_OPTIONS = [
  "SINGER",
  "BAND",
  "DJ",
  "RAPPER",
  "DANCER",
  "SPEAKER",
  "OTHER",
];

const MAX_ARTIST_NAME_LENGTH = 100;
const MAX_CUSTOM_CATEGORY_LENGTH = 50;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;
const MAX_NOTES_LENGTH = 500;

function AddArtistLead() {
  const initialFormData = {
    artistName: "",
    category: "BAND",
    customCategory: "",
    email: "",
    phoneNumber: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [events, setEvents] = useState([]);
  const [registeredArtists, setRegisteredArtists] = useState([]);
  const [artistLeads, setArtistLeads] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    loadSuggestedArtists();
  }, []);

  const loadSuggestedArtists = async () => {
    setLoadingSuggestions(true);

    try {
      const [eventsResponse, artistsResponse, leadsResponse] =
        await Promise.all([
          axios.get("http://localhost:8080/api/admin/events"),
          artistService.getAllArtists(),
          artistLeadService.getAllLeads(),
        ]);

      const eventData = eventsResponse.data || [];
      const artistData = artistsResponse.data || [];
      const leadData = leadsResponse.data || [];

      const withArtists = eventData.filter(
        (event) => event.artists && event.artists.trim()
      );

      setEvents(withArtists);
      setRegisteredArtists(artistData);
      setArtistLeads(leadData);
    } catch (err) {
      console.error("Error loading suggested artists:", err);
      setEvents([]);
      setRegisteredArtists([]);
      setArtistLeads([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const sanitizeNameInput = (value) =>
    value.replace(/\s+/g, " ").slice(0, MAX_ARTIST_NAME_LENGTH);

  const sanitizeCustomCategoryInput = (value) =>
    value.replace(/\s+/g, " ").slice(0, MAX_CUSTOM_CATEGORY_LENGTH);

  const sanitizeEmailInput = (value) =>
    value.replace(/\s+/g, "").slice(0, MAX_EMAIL_LENGTH);

  const sanitizePhoneInput = (value) =>
    value.replace(/[^\d+\-\s()]/g, "").slice(0, MAX_PHONE_LENGTH);

  const sanitizeNotesInput = (value) =>
    value.replace(/\s{3,}/g, "  ").slice(0, MAX_NOTES_LENGTH);

  const normalizePhoneNumber = (value) => value.replace(/[\s()-]/g, "");

  const getFinalCategory = (data) => {
    if (data.category === "OTHER") {
      return (data.customCategory || "").trim().replace(/\s+/g, " ");
    }
    return data.category;
  };

  const cleanFormData = (data) => ({
    artistName: (data.artistName || "").trim().replace(/\s+/g, " "),
    category:
      data.category === "OTHER"
        ? (data.customCategory || "").trim().replace(/\s+/g, " ").toUpperCase()
        : data.category,
    email: (data.email || "").trim().toLowerCase(),
    phoneNumber: (data.phoneNumber || "").trim().replace(/\s+/g, " "),
    notes: (data.notes || "").trim().replace(/\s+/g, " "),
  });

  const validateForm = (data) => {
    const newErrors = {};

    const artistName = (data.artistName || "").trim().replace(/\s+/g, " ");
    const category = data.category || "";
    const customCategory = (data.customCategory || "")
      .trim()
      .replace(/\s+/g, " ");
    const email = (data.email || "").trim().toLowerCase();
    const phoneNumber = (data.phoneNumber || "")
      .trim()
      .replace(/\s+/g, " ");
    const notes = (data.notes || "").trim().replace(/\s+/g, " ");

    if (!artistName) {
      newErrors.artistName = "Artist name is required.";
    } else if (artistName.length < 2) {
      newErrors.artistName = "Artist name must be at least 2 characters.";
    } else if (artistName.length > MAX_ARTIST_NAME_LENGTH) {
      newErrors.artistName = `Artist name cannot exceed ${MAX_ARTIST_NAME_LENGTH} characters.`;
    } else if (!/^[a-zA-Z0-9 .,'&()/\-]+$/.test(artistName)) {
      newErrors.artistName = "Artist name contains invalid characters.";
    }

    if (!category) {
      newErrors.category = "Category is required.";
    } else if (!CATEGORY_OPTIONS.includes(category)) {
      newErrors.category = "Please select a valid category.";
    }

    if (category === "OTHER") {
      if (!customCategory) {
        newErrors.customCategory = "Please enter a custom category.";
      } else if (customCategory.length < 2) {
        newErrors.customCategory =
          "Custom category must be at least 2 characters.";
      } else if (customCategory.length > MAX_CUSTOM_CATEGORY_LENGTH) {
        newErrors.customCategory = `Custom category cannot exceed ${MAX_CUSTOM_CATEGORY_LENGTH} characters.`;
      } else if (!/^[a-zA-Z0-9 .,'&()/\-]+$/.test(customCategory)) {
        newErrors.customCategory =
          "Custom category contains invalid characters.";
      }
    }

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (email.length > MAX_EMAIL_LENGTH) {
      newErrors.email = `Email address cannot exceed ${MAX_EMAIL_LENGTH} characters.`;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (email.startsWith(".")) {
      newErrors.email = "Please enter a valid email address.";
    } else if (email.endsWith(".")) {
      newErrors.email = "Please enter a valid email address.";
    } else if (email.includes("..")) {
      newErrors.email = "Email address cannot contain consecutive dots.";
    }

    if (phoneNumber) {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);

      if (!/^\+?\d{7,15}$/.test(normalizedPhone)) {
        newErrors.phoneNumber =
          "Phone number must contain 7 to 15 digits and may start with +.";
      } else if ((normalizedPhone.match(/\+/g) || []).length > 1) {
        newErrors.phoneNumber = "Phone number format is invalid.";
      } else if (
        normalizedPhone.includes("+") &&
        !normalizedPhone.startsWith("+")
      ) {
        newErrors.phoneNumber = "Phone number format is invalid.";
      }
    }

    if (notes.length > MAX_NOTES_LENGTH) {
      newErrors.notes = `Notes cannot exceed ${MAX_NOTES_LENGTH} characters.`;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "artistName") {
      sanitizedValue = sanitizeNameInput(value);
    } else if (name === "customCategory") {
      sanitizedValue = sanitizeCustomCategoryInput(value);
    } else if (name === "email") {
      sanitizedValue = sanitizeEmailInput(value);
    } else if (name === "phoneNumber") {
      sanitizedValue = sanitizePhoneInput(value);
    } else if (name === "notes") {
      sanitizedValue = sanitizeNotesInput(value);
    }

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        customCategory: value === "OTHER" ? prev.customCategory : "",
      }));

      setErrors((prev) => ({
        ...prev,
        category: "",
        customCategory: "",
      }));

      setMessage("");
      setError("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
    setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validateForm(formData);

    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name] || "",
      ...(name === "category" || name === "customCategory"
        ? { customCategory: validationErrors.customCategory || "" }
        : {}),
    }));
  };

  const fillFromSuggestion = (artist) => {
    setFormData({
      artistName: artist.artistName || "",
      category: "BAND",
      customCategory: "",
      email: "",
      phoneNumber: "",
      notes: `Suggested from event: ${artist.eventName}`,
    });

    setErrors({});
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setMessage("");
    setError("");

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const cleanedData = cleanFormData(formData);

    try {
      setSubmitting(true);
      await artistLeadService.createLead(cleanedData);

      setMessage(
        "Artist lead added successfully. Next step: go to Send Invitation and invite this lead to an event."
      );
      setFormData(initialFormData);
      setErrors({});

      await loadSuggestedArtists();
    } catch (err) {
      console.error(err);
      setError("Failed to add artist lead.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayCategory =
    formData.category === "OTHER"
      ? getFinalCategory(formData) || "Other"
      : formData.category;

  const hasPreview =
    (formData.artistName || "").trim() ||
    (formData.customCategory || "").trim() ||
    (formData.email || "").trim() ||
    (formData.phoneNumber || "").trim() ||
    (formData.notes || "").trim();

  const unregisteredArtists = useMemo(() => {
    const registeredNames = new Set(
      (registeredArtists || [])
        .map((artist) => (artist.artistName || "").trim().toLowerCase())
        .filter(Boolean)
    );

    const leadNames = new Set(
      (artistLeads || [])
        .map((lead) => (lead.artistName || "").trim().toLowerCase())
        .filter(Boolean)
    );

    const suggestions = [];

    (events || []).forEach((event) => {
      const names = event.artists
        ? event.artists.split(",").map((name) => name.trim()).filter(Boolean)
        : [];

      names.forEach((name) => {
        const normalizedName = name.toLowerCase();
        const alreadyRegistered = registeredNames.has(normalizedName);
        const alreadyAddedAsLead = leadNames.has(normalizedName);

        if (!alreadyRegistered && !alreadyAddedAsLead) {
          suggestions.push({
            id: `${event.id}-${name}`,
            artistName: name,
            eventName: event.eventName,
            venue: event.venue,
            eventDate: event.eventDate,
          });
        }
      });
    });

    const uniqueMap = new Map();
    suggestions.forEach((artist) => {
      const key = artist.artistName.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, artist);
      }
    });

    return Array.from(uniqueMap.values());
  }, [events, registeredArtists, artistLeads]);

  return (
    <ArtistModuleLayout
      title="Add Artist Lead"
      subtitle="Register a potential artist before sending an invitation."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div className="artist-form-card" style={{ width: "100%" }}>
            <h2 className="artist-form-title">New Artist Lead</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="artist-form-grid">
                <div className="artist-form-group">
                  <label className="artist-form-label" htmlFor="artistName">
                    Artist Name
                  </label>
                  <input
                    id="artistName"
                    className="artist-form-input"
                    type="text"
                    name="artistName"
                    placeholder="Full name or stage name"
                    value={formData.artistName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={MAX_ARTIST_NAME_LENGTH}
                    autoComplete="name"
                    required
                  />
                  {errors.artistName && (
                    <p className="artist-form-message error">
                      {errors.artistName}
                    </p>
                  )}
                </div>

                <div className="artist-form-group">
                  <label className="artist-form-label" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    className="artist-form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="SINGER">Singer</option>
                    <option value="BAND">Band</option>
                    <option value="DJ">DJ</option>
                    <option value="RAPPER">Rapper</option>
                    <option value="DANCER">Dancer</option>
                    <option value="SPEAKER">Speaker</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.category && (
                    <p className="artist-form-message error">
                      {errors.category}
                    </p>
                  )}
                </div>

                {formData.category === "OTHER" && (
                  <div className="artist-form-group">
                    <label className="artist-form-label" htmlFor="customCategory">
                      Custom Category
                    </label>
                    <input
                      id="customCategory"
                      className="artist-form-input"
                      type="text"
                      name="customCategory"
                      placeholder="Enter category (e.g. Comedian, Magician)"
                      value={formData.customCategory}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={MAX_CUSTOM_CATEGORY_LENGTH}
                    />
                    {errors.customCategory && (
                      <p className="artist-form-message error">
                        {errors.customCategory}
                      </p>
                    )}
                  </div>
                )}

                <div className="artist-form-group">
                  <label className="artist-form-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="artist-form-input"
                    type="email"
                    name="email"
                    placeholder="artist@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={MAX_EMAIL_LENGTH}
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                  {errors.email && (
                    <p className="artist-form-message error">{errors.email}</p>
                  )}
                </div>

                <div className="artist-form-group">
                  <label className="artist-form-label" htmlFor="phoneNumber">
                    Contact Number
                  </label>
                  <input
                    id="phoneNumber"
                    className="artist-form-input"
                    type="tel"
                    name="phoneNumber"
                    placeholder="+94 77 000 0000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={MAX_PHONE_LENGTH}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {errors.phoneNumber && (
                    <p className="artist-form-message error">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="artist-form-group">
                <label className="artist-form-label" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  className="artist-form-textarea"
                  name="notes"
                  placeholder="Any additional notes about this artist lead..."
                  value={formData.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={MAX_NOTES_LENGTH}
                />
                {errors.notes ? (
                  <p className="artist-form-message error">{errors.notes}</p>
                ) : (
                  <p className="artist-preview-hint">
                    {formData.notes.length}/{MAX_NOTES_LENGTH} characters
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="artist-form-button"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Artist Lead"}
              </button>
            </form>

            {message && <p className="artist-form-message success">{message}</p>}
            {error && <p className="artist-form-message error">{error}</p>}
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="ah-section-heading" style={{ marginTop: 0 }}>
              Not Registered Yet
            </div>

            {loadingSuggestions ? (
              <div className="ah-card">
                <div className="artist-preview-hint">Loading artists...</div>
              </div>
            ) : unregisteredArtists.length > 0 ? (
              unregisteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="ah-card"
                  style={{ marginBottom: 14, cursor: "pointer" }}
                  onClick={() => fillFromSuggestion(artist)}
                  title="Click to fill the form"
                >
                  <div className="artist-preview-top-label">Suggested Artist</div>

                  <div className="artist-preview-name" style={{ marginBottom: 8 }}>
                    {artist.artistName}
                  </div>

                  <span className="artist-preview-badge">NOT REGISTERED</span>

                  <div className="ah-card-row" style={{ marginTop: 12 }}>
                    <span className="ah-card-label">Event</span>
                    <span className="ah-card-value">{artist.eventName}</span>
                  </div>

                  <div className="ah-card-row">
                    <span className="ah-card-label">Venue</span>
                    <span className="ah-card-value">{artist.venue}</span>
                  </div>

                  <div className="ah-card-row">
                    <span className="ah-card-label">Date</span>
                    <span className="ah-card-value">{artist.eventDate}</span>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div className="artist-preview-top-label">Action</div>
                    <div className="artist-preview-hint">
                      Click this card to auto-fill the form and register this artist.
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="ah-card">
                <div className="artist-preview-hint">
                  No unregistered artists found.
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: "sticky",
            top: 20,
            alignSelf: "start",
            minWidth: 0,
          }}
        >
          <div className="ah-section-heading" style={{ marginTop: 0 }}>
            Preview
          </div>

          <div className="ah-card">
            <div className="artist-preview-top-label">Artist Lead</div>

            <div className="artist-preview-name">
              {(formData.artistName || "").trim() || "Artist name"}
            </div>

            <span className="artist-preview-badge">{displayCategory}</span>

            <div className="ah-card-row" style={{ marginTop: 12 }}>
              <span className="ah-card-label">Email</span>
              <span className="ah-card-value">
                {(formData.email || "").trim() || "artist@email.com"}
              </span>
            </div>

            <div className="ah-card-row">
              <span className="ah-card-label">Phone</span>
              <span className="ah-card-value">
                {(formData.phoneNumber || "").trim() || "+94 77 000 0000"}
              </span>
            </div>

            <div className="artist-preview-notes-block">
              <div className="artist-preview-top-label">Notes</div>
              <div className="artist-preview-notes-text">
                {(formData.notes || "").trim() ||
                  "Any additional notes about this artist lead will appear here."}
              </div>
            </div>
          </div>

          {!hasPreview && (
            <div className="artist-preview-hint" style={{ marginTop: 12 }}>
              Start filling the form to preview the artist lead details.
            </div>
          )}
        </div>
      </div>
    </ArtistModuleLayout>
  );
}

export default AddArtistLead;