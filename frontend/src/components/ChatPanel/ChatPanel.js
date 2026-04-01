import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import "./ChatPanel.css";

const ChatPanel = ({ eventId, senderType, senderName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const stompRef = useRef(null);
  const bottomRef = useRef(null);

  // Load history + mark as read
  useEffect(() => {
    axios.get(`http://localhost:8080/api/chat/${eventId}`)
      .then(res => setMessages(res.data))
      .catch(console.error);

    // Mark all existing messages as read for this viewer
    axios.put(`http://localhost:8080/api/chat/${eventId}/mark-read?viewerType=${senderType}`)
      .catch(console.error);
  }, [eventId, senderType]);

  // Connect WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-chat"),
      onConnect: () => {
        client.subscribe(`/topic/chat/${eventId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages(prev => [...prev, msg]);
          // Mark as read immediately since panel is open
          axios.put(`http://localhost:8080/api/chat/${eventId}/mark-read?viewerType=${senderType}`)
            .catch(console.error);
        });
      },
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [eventId, senderType]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !stompRef.current?.connected) return;
    stompRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ eventId, senderType, senderName, content: input.trim() }),
    });
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleClear = () => {
    axios.delete(`http://localhost:8080/api/chat/${eventId}/clear`)
      .then(() => { setMessages([]); setConfirmClear(false); })
      .catch(console.error);
  };

  const fmt = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="cp-overlay">
      <div className="cp-panel">
        <div className="cp-header">
          <span>💬 Event Chat</span>
          <div className="cp-header-actions">
            {senderType === "SOCIETY" && !confirmClear && (
              <button className="cp-clear-btn" onClick={() => setConfirmClear(true)} title="Clear chat">
                🗑
              </button>
            )}
            {confirmClear && (
              <div className="cp-confirm-clear">
                <span>Clear all?</span>
                <button className="cp-confirm-yes" onClick={handleClear}>Yes</button>
                <button className="cp-confirm-no" onClick={() => setConfirmClear(false)}>No</button>
              </div>
            )}
            <button className="cp-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cp-messages">
          {messages.length === 0 && (
            <p className="cp-empty">No messages yet. Start the conversation.</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`cp-msg ${m.senderType === senderType ? "cp-msg-mine" : "cp-msg-other"}`}>
              <div className="cp-msg-meta">
                <span className="cp-msg-sender">{m.senderName}</span>
                <span className="cp-msg-time">{fmt(m.sentAt)}</span>
              </div>
              <div className="cp-msg-bubble">{m.content}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="cp-input-row">
          <input
            className="cp-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="cp-send-btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
