function MemberList({ members }) {
  if (!members || members.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "32px 16px",
        color: "var(--text-muted)",
        fontSize: "13px",
        fontFamily: "'Space Mono', monospace"
      }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>👥</div>
        No members loaded
      </div>
    );
  }

  const uniqueMembers = members.filter(
    (m, index, self) => index === self.findIndex((x) => x.userId === m.userId)
  );

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {uniqueMembers.map((member) => (
        <li
          key={member.userId}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            marginBottom: "8px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "13px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "700",
              color: "#050d18",
              fontFamily: "'Space Mono', monospace"
            }}>
              {String(member.userId).slice(-2)}
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", color: "var(--text-dim)", fontSize: "12px" }}>
              ID: {member.userId}
            </span>
          </div>
          <span style={{
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontFamily: "'Space Mono', monospace",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: member.role === "admin"
              ? "rgba(52, 211, 153, 0.15)"
              : "rgba(56, 189, 248, 0.1)",
            color: member.role === "admin"
              ? "var(--accent3)"
              : "var(--accent)",
            border: `1px solid ${member.role === "admin" ? "rgba(52,211,153,0.25)" : "rgba(56,189,248,0.2)"}`
          }}>
            {member.role}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default MemberList;