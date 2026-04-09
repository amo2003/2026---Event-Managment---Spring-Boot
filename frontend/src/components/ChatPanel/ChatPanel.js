import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import "./ChatPanel.css";

const BASE = "http://localhost:8080";

const ChatPanel = ({ eventId, senderType, senderName, onClose }) => {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const stompRef  = useRef(null);
  const bottomRef = useRef(null);
  const fileRef   = useRef(null);

  useEffect(() => {
    axios.get(`${BASE}/api/chat/${eventId}`)
      .then(res => setMessages(res.data))
      .catch(console.error);
    axios.put(`${BASE}/api/chat/${eventId}/mark-read?viewerType=${senderType}`)
      .catch(console.error);
  }, [eventId, senderType]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE}/ws-chat`),
      onConnect: () => {
        client.subscribe(`/topic/chat/${eventId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages(prev => [...prev, msg]);
          axios.put(`${BASE}/api/chat/${eventId}/mark-read?viewerType=${senderType}`)
            .catch(console.error);
        });
      },
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [eventId, senderType]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const hasText  = input.trim();
    const hasImage = !!imageFile;
    if (!hasText && !hasImage) return;
    if (!stompRef.current?.connected) return;

    let uploadedUrl = null;
    if (hasImage) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await axios.post(`${BASE}/api/chat/upload-image`, fd);
        uploadedUrl = res.data.imageUrl;
      } catch { setUploading(false); return; }
      setUploading(false);
    }

    stompRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        eventId,
        senderType,
        senderName,
        content: hasText ? input.trim() : "",
        imageUrl: uploadedUrl || null,
      }),
    });
    setInput("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleClear = () => {
    axios.delete(`${BASE}/api/chat/${eventId}/clear`)
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

        {/* Header */}
        <div className="cp-header">
          <span>💬 Event Chat</span>
          <div className="cp-header-actions">
            {!confirmClear && (
              <button className="cp-clear-btn" onClick={() => setConfirmClear(true)} title="Clear chat">Clear Chat</button>
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

        {/* Messages */}
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
              {m.imageUrl && (
                <img
                  src={`${BASE}/uploads/chat/${m.imageUrl}`}
                  alt="attachment"
                  className="cp-msg-img"
                  onClick={() => window.open(`${BASE}/uploads/chat/${m.imageUrl}`, "_blank")}
                />
              )}
              {m.content && <div className="cp-msg-bubble">{m.content}</div>}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Image preview strip */}
        {imagePreview && (
          <div className="cp-img-preview">
            <img src={imagePreview} alt="preview" />
            <button className="cp-img-remove" onClick={() => { setImageFile(null); setImagePreview(null); }}>✕</button>
          </div>
        )}

        {/* Input row */}
        <div className="cp-input-row">
          <button className="cp-img-btn" onClick={() => fileRef.current.click()} title="Attach image">📎</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImagePick} />
          <input
            className="cp-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="cp-send-btn" onClick={send} disabled={uploading}>
            {uploading ? "…" : "Send"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatPanel;
