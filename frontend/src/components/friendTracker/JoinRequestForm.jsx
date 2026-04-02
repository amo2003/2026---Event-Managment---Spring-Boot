import { useState } from "react";

function JoinRequestForm({ onSendRequest }) {
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!groupId.trim() || !userId.trim() || !userName.trim()) return;

    onSendRequest({
      groupId: Number(groupId),
      invitedUserId: Number(userId),
      invitedUserName: userName.trim(),
      invitedBy: Number(userId),
      invitedByName: userName.trim()
    });

    setGroupId("");
    setUserId("");
    setUserName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="ft-input"
        type="number"
        placeholder="Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />

      <input
        className="ft-input"
        type="number"
        placeholder="Your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <input
        className="ft-input"
        type="text"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <button
        type="submit"
        className="ft-btn ft-btn-purple"
        style={{ width: "100%" }}
      >
        → Send Join Request
      </button>
    </form>
  );
}

export default JoinRequestForm;