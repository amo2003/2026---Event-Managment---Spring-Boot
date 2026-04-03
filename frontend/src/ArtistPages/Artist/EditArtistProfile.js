import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import artistService from "../../services/artistService";
import { AuthContext } from "../../context/AuthContext";
import ArtistModuleLayout from "../../Pages/ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function EditArtistProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    artistName: "",
    category: "SINGER",
    email: "",
    phoneNumber: "",
    bio: "",
    portfolioLink: "",
    socialLink: "",
    performancePreferences: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const artistId = user?.userType === "artist" ? user.id : null;

  useEffect(() => {
    if (!artistId) { setError("Artist login required."); setLoading(false); return; }
    artistService.getArtistById(artistId)
      .then((res) => {
        const d = res.data;
        setFormData({
          artistName:             d.artistName || "",
          category:               d.category || "SINGER",
          email:                  d.email || "",
          phoneNumber:            d.phoneNumber || "",
          bio:                    d.bio || "",
          portfolioLink:          d.portfolioLink || "",
          socialLink:             d.socialLink || "",
          performancePreferences: d.performancePreferences || "",
          notes:                  d.notes || "",
        });
      })
      .catch(() => setError("Failed to load profile data."))
      .finally(() => setLoading(false));
  }, [artistId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await artistService.updateArtist(artistId, formData);
      setMessage("Profile updated successfully.");
      setTimeout(() => navigate("/artist/profile"), 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  return (
    <ArtistModuleLayout title="Edit Profile" subtitle="Update your public artist information.">
      {error && <div className="ah-error">{error}</div>}

      {loading ? (
        <div className="ah-state"><div className="ah-state-icon">◌</div>Loading profile…</div>
      ) : (
        <div className="artist-form-card" style={{ maxWidth: 580 }}>
          <h2 className="artist-form-title">Edit Artist Profile</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="artist-form-group">
                <label className="artist-form-label">Artist Name</label>
                <input className="artist-form-input" type="text" name="artistName"
                  placeholder="Your stage name" value={formData.artistName} onChange={handleChange} required />
              </div>

              <div className="artist-form-group">
                <label className="artist-form-label">Category</label>
                <select className="artist-form-select" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="SINGER">Singer</option>
                  <option value="BAND">Band</option>
                  <option value="DJ">DJ</option>
                  <option value="RAPPER">Rapper</option>
                  <option value="DANCER">Dancer</option>
                  <option value="SPEAKER">Speaker</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="artist-form-group">
                <label className="artist-form-label">Email</label>
                <input className="artist-form-input" type="email" name="email"
                  placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="artist-form-group">
                <label className="artist-form-label">Phone Number</label>
                <input className="artist-form-input" type="text" name="phoneNumber"
                  placeholder="+94 77 000 0000" value={formData.phoneNumber} onChange={handleChange} />
              </div>

              <div className="artist-form-group">
                <label className="artist-form-label">Portfolio Link</label>
                <input className="artist-form-input" type="url" name="portfolioLink"
                  placeholder="https://yourportfolio.com" value={formData.portfolioLink} onChange={handleChange} />
              </div>

              <div className="artist-form-group">
                <label className="artist-form-label">Social Media Link</label>
                <input className="artist-form-input" type="url" name="socialLink"
                  placeholder="https://instagram.com/yourhandle" value={formData.socialLink} onChange={handleChange} />
              </div>
            </div>

            <div className="artist-form-group">
              <label className="artist-form-label">Bio</label>
              <textarea className="artist-form-textarea" name="bio" style={{ minHeight: 80 }}
                placeholder="Tell organizers about yourself…" value={formData.bio} onChange={handleChange} />
            </div>

            <div className="artist-form-group">
              <label className="artist-form-label">Performance Preferences</label>
              <input className="artist-form-input" type="text" name="performancePreferences"
                placeholder="e.g. Outdoor stages, evening events" value={formData.performancePreferences} onChange={handleChange} />
            </div>

            <div className="artist-form-group">
              <label className="artist-form-label">Notes</label>
              <textarea className="artist-form-textarea" name="notes" style={{ minHeight: 70 }}
                placeholder="Any additional notes…" value={formData.notes} onChange={handleChange} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="artist-form-button">Save Changes</button>
              <button type="button" className="ah-btn" style={{ flex: "none", padding: "10px 20px" }}
                onClick={() => navigate("/artist/profile")}>
                Cancel
              </button>
            </div>
          </form>

          {message && <p className="artist-form-message success">{message}</p>}
          {error && <p className="artist-form-message error">{error}</p>}
        </div>
      )}
    </ArtistModuleLayout>
  );
}

export default EditArtistProfile;