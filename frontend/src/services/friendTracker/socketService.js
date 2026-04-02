let socket = null;

export function connectSocket(onMessage) {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  socket = new WebSocket("ws://localhost:8080/signal");

  socket.onopen = () => {
    console.log("Connected to signaling server");
  };

  socket.onmessage = (event) => {
    try {
      const data =
        typeof event.data === "string"
          ? JSON.parse(event.data)
          : event.data;

      console.log("Socket received:", data);

      if (onMessage) onMessage(data);
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
  sendMessage({
    type: "join",
    groupId: Number(groupId),
    fromUserId: Number(userId)
  });
}