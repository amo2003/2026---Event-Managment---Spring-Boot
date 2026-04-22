let socket = null;
let currentOnMessage = null;
let reconnectTimeout = null;
let currentGroupId = null;
let currentUserId = null;

export function connectSocket(onMessage) {
  currentOnMessage = onMessage;

  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  socket = new WebSocket("ws://localhost:8080/signal");

  socket.onopen = () => {
    console.log("Connected to signaling server");

    // auto rejoin after reconnect
    if (currentGroupId != null && currentUserId != null) {
      sendMessage({
        type: "join",
        groupId: Number(currentGroupId),
        fromUserId: Number(currentUserId)
      });
      console.log("Rejoined group after reconnect:", currentGroupId, currentUserId);
    }
  };

  socket.onmessage = (event) => {
    try {
      const data =
        typeof event.data === "string"
          ? JSON.parse(event.data)
          : event.data;

      console.log("Socket received:", data);

      if (currentOnMessage) currentOnMessage(data);
    } catch (error) {
      console.error("Failed to parse socket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("Disconnected from signaling server");
    socket = null;

    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        console.log("Reconnecting to signaling server...");
        connectSocket(currentOnMessage);
      }, 2000);
    }
  };
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("Socket sent:", message);
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open. Cannot send message:", message);
  }
}

export function joinGroup(groupId, userId) {
  currentGroupId = Number(groupId);
  currentUserId = Number(userId);

  sendMessage({
    type: "join",
    groupId: Number(groupId),
    fromUserId: Number(userId)
  });
}