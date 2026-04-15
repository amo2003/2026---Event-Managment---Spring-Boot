import React from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistPortal.css";

function ArtistPortalHome() {
  const navigate = useNavigate();

  return (
    <div className="artist-portal-page">
      <div className="artist-portal-card" style={{ textAlign: "center" }}>
        <h1>Artist Portal</h1>
        <p>Temporary test mode</p>

        <button onClick={() => navigate("/artist-login")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default ArtistPortalHome;