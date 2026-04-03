const BASE_URL = "http://localhost:8080/api";

export async function getGroupMembers(groupId) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}/members`);

  if (!response.ok) {
    throw new Error("Failed to fetch group members");
  }

  return response.json();
}

export async function createGroup(groupData) {
  const response = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(groupData)
  });

  if (!response.ok) {
    throw new Error("Failed to create group");
  }

  return response.json();
}

export async function sendJoinRequest(requestData) {
  const response = await fetch(`${BASE_URL}/invites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  });

  if (!response.ok) {
    throw new Error("Failed to send join request");
  }

  return response.json();
}

export async function getPendingRequests(groupId) {
  const response = await fetch(`${BASE_URL}/invites/group/${groupId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch pending requests");
  }

  return response.json();
}

export async function acceptJoinRequest(inviteId) {
  const response = await fetch(`${BASE_URL}/invites/${inviteId}/accept`, {
    method: "PUT"
  });

  if (!response.ok) {
    throw new Error("Failed to accept join request");
  }

  return response.json();
}

export async function getGroupById(groupId) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch group");
  }

  return response.json();
}

export async function rejectJoinRequest(inviteId) {
  const response = await fetch(`${BASE_URL}/invites/${inviteId}/reject`, {
    method: "PUT"
  });

  if (!response.ok) {
    throw new Error("Failed to reject join request");
  }

  return response.json();
}