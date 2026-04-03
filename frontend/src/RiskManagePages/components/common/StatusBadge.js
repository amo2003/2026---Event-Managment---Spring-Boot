import React from "react";

const StatusBadge = ({ value }) => {
  const normalized = (value || "").toLowerCase().replace(/\s+/g, "-");

  return <span className={`status-badge ${normalized}`}>{value}</span>;
};

export default StatusBadge;