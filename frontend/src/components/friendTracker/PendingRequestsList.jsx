function PendingRequestsList({ requests, onAccept }) {
  if (requests.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "32px 16px",
        color: "var(--text-muted)",
        fontSize: "13px",
        fontFamily: "'Space Mono', monospace"
      }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>📭</div>
        No pending requests
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {requests.map((request) => (
        <li
          key={request.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            marginBottom: "8px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            gap: "8px",
            flexWrap: "wrap"
          }}
        >
          <div style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "var(--text-dim)", lineHeight: "1.6" }}>
            <div>Request <span style={{ color: "var(--accent)" }}>#{request.id}</span></div>
            <div>User <span style={{ color: "var(--text)" }}>{request.invitedUserId}</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "11px",
              fontFamily: "'Space Mono', monospace",
              fontWeight: "700",
              textTransform: "uppercase",
              background: "rgba(251,191,36,0.12)",
              color: "#fbbf24",
              border: "1px solid rgba(251,191,36,0.25)"
            }}>
              {request.status}
            </span>
            <button
              className="ft-btn ft-btn-success ft-btn-sm"
              onClick={() => onAccept(request.id)}
            >
              ✓ Accept
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PendingRequestsList;