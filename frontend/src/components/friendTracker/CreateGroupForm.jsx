import { useState } from "react";

const CAMPUS_LAT = 6.91553;
const CAMPUS_LNG = 79.97326;

function CreateGroupForm({ onCreateGroup }) {
  const [groupName, setGroupName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [adminName, setAdminName] = useState("");
  const [eventRadius, setEventRadius] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !groupName.trim() ||
      !createdBy.trim() ||
      !adminName.trim() ||
      !eventRadius.trim()
    ) {
      return;
    }

    onCreateGroup({
      name: groupName,
      createdBy: Number(createdBy),
      adminName: adminName.trim(),
      eventLatitude: CAMPUS_LAT,
      eventLongitude: CAMPUS_LNG,
      eventRadius: Number(eventRadius)
    });

    setGroupName("");
    setCreatedBy("");
    setAdminName("");
    setEventRadius("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="ft-input"
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <input
        className="ft-input"
        type="number"
        placeholder="Admin User ID"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
      />

      <input
        className="ft-input"
        type="text"
        placeholder="Admin Name"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
      />

      <input
        className="ft-input"
        type="number"
        placeholder="Event Radius (meters)"
        value={eventRadius}
        onChange={(e) => setEventRadius(e.target.value)}
      />

      <button
        type="submit"
        className="ft-btn ft-btn-success"
        style={{ width: "100%" }}
      >
        + Create Group
      </button>
    </form>
  );
}

export default CreateGroupForm;