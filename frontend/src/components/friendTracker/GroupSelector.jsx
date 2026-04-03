function GroupSelector({ selectedGroup, setSelectedGroup }) {
  return (
    <div>
      <label
        htmlFor="groupIdInput"
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "12px",
          fontFamily: "'Space Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "var(--text-muted)"
        }}
      >
        Group ID
      </label>
      <input
        id="groupIdInput"
        className="ft-input"
        type="text"
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        placeholder="Enter numeric group ID"
        style={{ marginBottom: 0 }}
      />
    </div>
  );
}

export default GroupSelector;