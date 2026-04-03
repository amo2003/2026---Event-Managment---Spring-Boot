import React, { useEffect, useState } from "react";
import artistService from "../../services/artistService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ArtistProfile() {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary artist ID for visualization
  const artistId = 1;

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await artistService.getArtistById(artistId);
        setArtist(response.data || null);
      } catch (err) {
        console.error("Error fetching artist profile:", err);
        setError("Failed to load artist profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  return (
    <ArtistModuleLayout
      title="Artist Profile"
      subtitle="View your artist details and performance information."
    >
      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading profile…
        </div>
      ) : error ? (
        <div className="ah-error">{error}</div>
      ) : !artist ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No artist profile found.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          <div className="ah-card">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--ah-accent-dim)",
                  border: "1px solid rgba(139,92,246,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--ah-accent-light)",
                  flexShrink: 0,
                }}
              >
                {getInitials(artist.artistName)}
              </div>

              <div>
                <div className="ah-card-title" style={{ marginBottom: 4 }}>
                  {artist.artistName}
                </div>
                <span className="ah-badge ah-badge-approved">
                  {artist.category || "Artist"}
                </span>
              </div>
            </div>

            <div className="ah-card-row">
              <span className="ah-card-label">Email</span>
              <span className="ah-card-value">{artist.email || "Not provided"}</span>
            </div>

            <div className="ah-card-row">
              <span className="ah-card-label">Phone</span>
              <span className="ah-card-value">{artist.phoneNumber || "Not provided"}</span>
            </div>

            {artist.bio && (
              <div style={{ marginTop: 16 }}>
                <div className="ah-section-heading" style={{ marginBottom: 8 }}>
                  Bio
                </div>
                <p style={{ fontSize: 13, color: "var(--ah-text-2)", lineHeight: 1.7 }}>
                  {artist.bio}
                </p>
              </div>
            )}

            {artist.performancePreferences && (
              <div style={{ marginTop: 16 }}>
                <div className="ah-section-heading" style={{ marginBottom: 8 }}>
                  Performance Preferences
                </div>
                <p style={{ fontSize: 13, color: "var(--ah-text-2)", lineHeight: 1.7 }}>
                  {artist.performancePreferences}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="ah-section-heading" style={{ marginTop: 0 }}>
              Links
            </div>

            <div className="ah-card">
              <div className="ah-card-row">
                <span className="ah-card-label">Portfolio</span>
                <span className="ah-card-value">
                  {artist.portfolioLink ? (
                    <a
                      href={artist.portfolioLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--ah-accent-light)" }}
                    >
                      View Portfolio
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              </div>

              <div className="ah-card-row">
                <span className="ah-card-label">Social</span>
                <span className="ah-card-value">
                  {artist.socialLink ? (
                    <a
                      href={artist.socialLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--ah-accent-light)" }}
                    >
                      View Social
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              </div>

              <div className="ah-card-row">
                <span className="ah-card-label">Status</span>
                <span className="ah-card-value">
                  {artist.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ArtistModuleLayout>
  );
}

export default ArtistProfile;