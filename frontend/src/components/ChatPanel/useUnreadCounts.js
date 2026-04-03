import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const useUnreadCounts = (eventIds, viewerType) => {
  const [unreadMap, setUnreadMap] = useState({});
  const stompRef = useRef(null);

  // Stable string key derived from eventIds — used as dependency
  const idsKey = eventIds.join(",");

  const fetchCounts = useCallback(() => {
    if (!idsKey) return;
    idsKey.split(",").filter(Boolean).forEach(id => {
      axios.get(`http://localhost:8080/api/chat/${id}/unread?viewerType=${viewerType}`)
        .then(res => setUnreadMap(prev => ({ ...prev, [id]: res.data.unread })))
        .catch(() => {});
    });
  }, [idsKey, viewerType]);

  // Initial fetch
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Live WebSocket subscription
  useEffect(() => {
    if (!idsKey) return;
    const ids = idsKey.split(",").filter(Boolean);

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-chat"),
      onConnect: () => {
        ids.forEach(id => {
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
  }, [idsKey, viewerType]);

  const clearUnread = (eventId) => {
    setUnreadMap(prev => ({ ...prev, [eventId]: 0 }));
  };

  return { unreadMap, clearUnread };
};

export default useUnreadCounts;
