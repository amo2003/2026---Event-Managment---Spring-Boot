import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DeanRespond.css";

const DeanRespond = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const defaultAction = searchParams.get("action") || "APPROVED";

  const [action, setAction] = useState(defaultAction);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error | already
  const [message, setMessage] = useState("");

  useEffect(() => { setAction(defaultAction); }, [defaultAction]);

  const handleSubmit = async () => {
    setStatus("submitting");
    try {
      const res = await axios.post(
        `http://localhost:8080/api/admin/events/dean-respond/${token}`,
        { action, comment }
      );
      if (res.data === "Already responded") {
        setStatus("already");
      } else {
        setStatus("done");
        setMessage(action === "APPROVED"
          ? "Thank you! Your approval has been recorded."
          : "Thank you! Your rejection has been recorded.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again or contact the admin.");
    }
  };

  if (status === "done" || status === "already") return (
    <div className="dr-page">
      <div className="dr-card">
        <div className={`dr-result-icon ${status === "already" ? "dr-icon-info" : action === "APPROVED" ? "dr-icon-success" : "dr-icon-reject"}`}>
          {status === "already" ? "ℹ️" : action === "APPROVED" ? "✅" : "❌"}
        </div>
        <h2 className="dr-result-title">
          {status === "already" ? "Already Responded" : "Response Recorded"}
        </h2>
        <p className="dr-result-sub">
          {status === "already"
            ? "This approval link has already been used."
            : message}
        </p>
      </div>
    </div>
  );

  return (
    <div className="dr-page">
      <div className="dr-card">
        <div className="dr-logo">🏛️</div>
        <h1 className="dr-title">Faculty Dean Response</h1>
        <p className="dr-sub">Please confirm your decision for the event approval request.</p>

        <div className="dr-action-toggle">
          <button
            className={`dr-toggle-btn ${action === "APPROVED" ? "dr-toggle-btn--approve" : ""}`}
            onClick={() => setAction("APPROVED")}
          >
            ✅ Approve
          </button>
          <button
            className={`dr-toggle-btn ${action === "REJECTED" ? "dr-toggle-btn--reject" : ""}`}
            onClick={() => setAction("REJECTED")}
          >
            ❌ Reject
          </button>
        </div>

        <div className="dr-field">
          <label>Comment <span className="dr-optional">(optional)</span></label>
          <textarea
            rows={4}
            placeholder="Add any remarks or reason for your decision..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        {status === "error" && <p className="dr-error">{message}</p>}

        <button
          className={`dr-submit-btn ${action === "REJECTED" ? "dr-submit-btn--reject" : ""}`}
          onClick={handleSubmit}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : `Submit ${action === "APPROVED" ? "Approval" : "Rejection"}`}
        </button>
      </div>
    </div>
  );
};

export default DeanRespond;
