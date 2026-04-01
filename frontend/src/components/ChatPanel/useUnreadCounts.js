import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

// Returns { unreadMap: { [eventId]: count }, clearUnread }
const useUnreadCounts = (eventIds, viewerType) => {
  const [unreadMap, setUnreadMap] = useState({});
  const stompRef = useRef(null);

  // Initial fetch for all events
  useEffect(() => {
    if (!eventIds || eventIds.length === 0) return;
    eventIds.forEach(id => {
      axios.get(`http://localhost:8080/api/chat/${id}/unread?viewerType=${viewerType}`)
        .then(res => setUnreadMap(prev => ({ ...prev, [id]: res.data.unread })))
        .catch(() => {});
    });
  }, [eventIds.join(","), viewerType]);

  // Subscribe to live unread updates via WebSocket
  useEffect(() => {
    if (!eventIds || eventIds.length === 0) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-chat"),
      onConnect: () => {
        eventIds.forEach(id => {
          client.subscribe(`/topic/unread/${id}`, (frame) => {
            const data = JSON.parse(frame.body);
            const count = viewerType === "ADMIN" ? data.adminUnread : data.societyUnread;
            setUnreadMap(prev => ({ ...prev, [id]: count }));
          });
        });
      },
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [eventIds.join(","), viewerType]);

  const clearUnread = (eventId) => {
    setUnreadMap(prev => ({ ...prev, [eventId]: 0 }));
  };

  return { unreadMap, clearUnread };
};

export default useUnreadCounts;
