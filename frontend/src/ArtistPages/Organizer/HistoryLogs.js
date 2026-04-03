import React, { useState } from "react";
import dashboardService from "../../services/dashboardService";
import ArtistModuleLayout from "../../ArtistPages/ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function HistoryLogs() {
  const [eventId, setEventId] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setError(""); setLoading(true);
    try {
      const response = await dashboardService.getSummaryByEvent(eventId);
      setSummary(response.data);
    } catch (err) {
      setError("Failed to fetch history logs");
      setSummary(null);
    } finally { setLoading(false); }
  };

  return (
    <ArtistModuleLayout title="History Logs" subtitle="Full summary of inquiries, invitations and voting for an event.">
      <div className="ah-inline-form">
        <input type="number" placeholder="Enter Event ID" value={eventId}
          onChange={(e) => setEventId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchHistory()} />
        <button className="ah-search-btn" onClick={fetchHistory}>View History</button>
      </div>
      {error && <div className="ah-error">{error}</div>}
      {loading && <div className="ah-state"><div className="ah-state-icon">◌</div>Loading…</div>}

      {summary && (
        <>
          <div className="ah-stats-grid">
            <div className="ah-stat">
              <div className="ah-stat-label">Total Inquiries</div>
              <div className="ah-stat-value accent">{summary.totalInquiries}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Interested</div>
              <div className="ah-stat-value green">{summary.interestedCount}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Not Interested</div>
              <div className="ah-stat-value rose">{summary.notInterestedCount}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Pending</div>
              <div className="ah-stat-value amber">{summary.pendingInquiryCount}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Total Invitations</div>
              <div className="ah-stat-value accent">{summary.totalInvitations}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Accepted</div>
              <div className="ah-stat-value green">{summary.acceptedCount}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Declined</div>
              <div className="ah-stat-value rose">{summary.declinedCount}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Finalized</div>
              <div className="ah-stat-value" style={{ color: "var(--ah-accent-light)" }}>{summary.finalizedCount}</div>
            </div>
            <div className="ah-stat">
              <div className="ah-stat-label">Calendar Confirmed</div>
              <div className="ah-stat-value teal">{summary.calendarConfirmedCount}</div>
            </div>
          </div>

          <div className="ah-section-heading">Vote Results</div>
          {summary.voteResults && summary.voteResults.length > 0 ? (
            summary.voteResults
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((vote, index) => {
                const max = summary.voteResults.reduce((m, v) => Math.max(m, v.voteCount), 1);
                return (
                  <div className="ah-card" key={index} style={{ padding: "12px 18px" }}>
                    <div className="ah-vote-rank">
                      <div className={`ah-vote-rank-num ${index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : ""}`}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: "var(--ah-text-1)" }}>Artist ID: {vote.artistId}</span>
                          <span style={{ fontSize: 13, color: "var(--ah-accent-light)", fontWeight: 600 }}>{vote.voteCount} votes</span>
                        </div>
                        <div className="ah-vote-bar-wrap">
                          <div className="ah-vote-bar" style={{ width: `${(vote.voteCount / max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="ah-state"><div className="ah-state-icon">⊘</div>No vote results found.</div>
          )}
        </>
      )}
    </ArtistModuleLayout>
  );
}

export default HistoryLogs;