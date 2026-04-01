let socket = null;

export function connectSocket(onMessage) {
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
  };
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function joinGroup(groupId, userId) {
  sendMessage({
    type: "join",
    groupId: Number(groupId),
    fromUserId: Number(userId)
  });
}