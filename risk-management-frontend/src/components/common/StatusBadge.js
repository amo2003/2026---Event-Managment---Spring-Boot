function StatusBadge({ status }) {
  const normalizedStatus = status ? status.toLowerCase() : "default";

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {status || "UNKNOWN"}
    </span>
  );
}

export default StatusBadge;