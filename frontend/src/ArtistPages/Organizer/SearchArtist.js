import React, { useEffect, useState } from "react";
import artistLeadService from "../../services/artistLeadService";
import ArtistModuleLayout from "../../ArtistPages/ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SearchArtist() {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    const q = searchTerm.toLowerCase();
    setFilteredArtists(
      artists.filter((a) =>
        a.artistName?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, artists]);

  const fetchArtists = async () => {
    try {
      const response = await artistLeadService.getAllLeads();
      setArtists(response.data);
      setFilteredArtists(response.data);
    } catch (error) {
      console.error("Error fetching artist leads:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ArtistModuleLayout
      title="Search Artists"
      subtitle="Browse and find registered artists in the system."
    >
      <div className="ah-search-bar">
        <input
          className="ah-search-input"
          type="text"
          placeholder="Search by name, category or email…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
          {filteredArtists.length} result{filteredArtists.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading artists…
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No artists found.
        </div>
      ) : (
        filteredArtists.map((artist) => (
          <div className="ah-card" key={artist.id}>
            <div className="ah-artist-header">
              <div className="ah-artist-avatar">
                {getInitials(artist.artistName)}
              </div>
              <div>
                <div className="ah-artist-name">{artist.artistName}</div>
                <div className="ah-artist-category">{artist.category}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span
                  className={`ah-badge ah-badge-${artist.category?.toLowerCase()}`}
                  style={{
                    background: "var(--ah-accent-dim)",
                    color: "var(--ah-accent-light)",
                  }}
                >
                  {artist.category}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px 20px",
              }}
            >
              {artist.email && (
                <div className="ah-card-row">
                  <span className="ah-card-label">Email</span>
                  <span className="ah-card-value">{artist.email}</span>
                </div>
              )}
              {artist.phoneNumber && (
                <div className="ah-card-row">
                  <span className="ah-card-label">Phone</span>
                  <span className="ah-card-value">{artist.phoneNumber}</span>
                </div>
              )}
            </div>

            {artist.notes && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ah-text-3)",
                  marginTop: 10,
                  lineHeight: 1.5,
                }}
              >
                {artist.notes}
              </p>
            )}
          </div>
        ))
      )}
    </ArtistModuleLayout>
  );
}

export default SearchArtist;