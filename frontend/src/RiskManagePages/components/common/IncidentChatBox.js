import React, { useEffect, useRef, useState } from "react";
import {
  getOfficerChatMessages,
  getPublicChatMessages,
  sendOfficerChatMessage,
  sendPublicChatMessage,
} from "../../api/incidentChatApi";

const IncidentChatBox = ({
  mode,
  trackingCode,
  incidentId,
  senderName = "Reporter",
  title = "Incident Chat",
  subtitle = "Live communication with the response team",
  compact = false,
  disabled = false,
}) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const canLoad =
    !disabled &&
    ((mode === "public" && trackingCode) || (mode === "officer" && incidentId));

  const loadMessages = async () => {
    if (!canLoad) return;

    try {
      const data =
        mode === "public"
          ? await getPublicChatMessages(trackingCode)
          : await getOfficerChatMessages(incidentId);

      setMessages(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load chat messages");
    }
  };

  useEffect(() => {
    loadMessages();

    const intervalId = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, trackingCode, incidentId, disabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    const cleanMessage = messageText.trim();

    if (!cleanMessage) {
      setError("Message cannot be empty");
      return;
    }

    if (cleanMessage.length > 500) {
      setError("Message must be under 500 characters");
      return;
    }

    setSending(true);
    setError("");

    try {
      if (mode === "public") {
        await sendPublicChatMessage(trackingCode, {
          senderName,
          message: cleanMessage,
        });
      } else {
        await sendOfficerChatMessage(incidentId, {
          message: cleanMessage,
        });
      }

      setMessageText("");
      await loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`chat-panel ${compact ? "compact" : ""}`}>
      <div className="chat-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        {!disabled && <span className="chat-live-dot">LIVE</span>}
      </div>

      {disabled ? (
        <div className="chat-empty-state">
          Chat becomes available after the incident is assigned to an officer.
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                No messages yet. Start the conversation.
              </div>
            ) : (
              messages.map((msg) => {
                const mine =
                  (mode === "public" && msg.senderType === "REPORTER") ||
                  (mode === "officer" && msg.senderType === "OFFICER");

                return (
                  <div
                    key={msg.id}
                    className={`chat-bubble-row ${mine ? "mine" : "theirs"}`}
                  >
                    <div className={`chat-bubble ${mine ? "mine" : "theirs"}`}>
                      <div className="chat-bubble-meta">
                        <strong>{msg.senderName}</strong>
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && <div className="chat-error">{error}</div>}

          <form onSubmit={handleSend} className="chat-send-row">
            <input
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                setError("");
              }}
              placeholder="Type message..."
              maxLength={500}
            />

            <button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default IncidentChatBox;