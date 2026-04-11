import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";

const SUGGESTIONS = [
  "How do I create an event?",
  "How to apply for a stall?",
  "How does event approval work?",
  "What venues are available?",
  "How to register as a society?",
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm the Uni Festivo assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    // Build history (exclude the initial greeting, max last 10 turns)
    const history = updated
      .slice(1)
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await axios.post("http://localhost:8080/api/chatbot/message", {
        message: msg,
        history: history.slice(0, -1), // exclude the message we just added
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.reply || err.message || "Sorry, I couldn't connect. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "👋 Hi! I'm the Uni Festivo assistant. How can I help you today?" }]);
    setShowSuggestions(true);
  };

  const fmt = (content) => content.split("\n").map((line, i) => (
    <span key={i}>{line}{i < content.split("\n").length - 1 && <br />}</span>
  ));

  return (
    <>
      {/* Floating button */}
      <button className={`cb-fab ${open ? "cb-fab--open" : ""}`} onClick={() => setOpen(p => !p)} aria-label="Chat">
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="cb-window">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">🎓</div>
              <div>
                <div className="cb-header-name">Uni Festivo Assistant</div>
                <div className="cb-header-status">
                  <span className="cb-dot" /> Online
                </div>
              </div>
            </div>
            <button className="cb-clear-btn" onClick={clearChat} title="Clear chat">🗑</button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg cb-msg--${m.role}`}>
                {m.role === "assistant" && <div className="cb-msg-avatar">🎓</div>}
                <div className="cb-bubble">{fmt(m.content)}</div>
              </div>
            ))}

            {loading && (
              <div className="cb-msg cb-msg--assistant">
                <div className="cb-msg-avatar">🎓</div>
                <div className="cb-bubble cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="cb-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="cb-suggestion" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="cb-input-row">
            <input
              ref={inputRef}
              className="cb-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button className="cb-send" onClick={() => send()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
