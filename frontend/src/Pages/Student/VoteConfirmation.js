import React from "react";
import { useNavigate } from "react-router-dom";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function VoteConfirmation() {
  const navigate = useNavigate();

  return (
    <ArtistModuleLayout title="Vote Submitted" subtitle="Thank you for participating.">
      <div style={{
        background: "var(--ah-card)",
        border: "1px solid var(--ah-border)",
        borderRadius: "var(--ah-radius-lg)",
        padding: "48px 32px",
        maxWidth: 440,
        textAlign: "center",
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--ah-green-dim)",
          border: "1px solid rgba(52,211,153,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 26,
        }}>
          ✓
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--ah-text-1)",
          marginBottom: 10,
        }}>
          Vote Recorded
        </h2>
        <p style={{ fontSize: 13, color: "var(--ah-text-2)", marginBottom: 28, lineHeight: 1.6 }}>
          Your vote has been successfully recorded. The results will be tallied once all votes are in.
        </p>
        <button
          className="artist-form-button"
          onClick={() => navigate("/student/artist-shortlist")}
          style={{ width: "auto", padding: "10px 28px" }}
        >
          Back to Shortlist
        </button>
      </div>
    </ArtistModuleLayout>
  );
}

export default VoteConfirmation;