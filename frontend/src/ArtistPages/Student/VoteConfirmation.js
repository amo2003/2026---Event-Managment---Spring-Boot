import React from "react";
import { useNavigate } from "react-router-dom";
import "./VoteConfirmation.css";

function VoteConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="vote-confirmation-page">
      
      <section className="vote-confirmation-content">
        <div className="vote-confirmation-card">
          <div className="vote-confirmation-icon">✓</div>

          <p className="vote-confirmation-badge">VOTE SUBMITTED</p>

          <h1>Vote Recorded Successfully</h1>

          <p className="vote-confirmation-text">
            Thank you for participating. Your vote has been successfully recorded.
            The final results will be tallied once all student votes are in.
          </p>

          <div className="vote-confirmation-actions">
            <button
              className="vote-confirmation-primary-btn"
              onClick={() => navigate("/student/final-artist")}
              type="button"
            >
              Back to Shortlist
            </button>

            <button
              className="vote-confirmation-secondary-btn"
              onClick={() => navigate("/")}
              type="button"
            >
              Back Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VoteConfirmation;