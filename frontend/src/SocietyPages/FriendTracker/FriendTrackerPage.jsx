import { useEffect, useMemo, useRef, useState } from "react";
import MapView from "../../components/friendTracker/MapView";
import {
  connectSocket,
  sendMessage,
  joinGroup
} from "../../services/friendTracker/socketService";
import {
  initializeWebRTC,
  hasPeerConnection,
  createOfferForUser,
  handleOfferFromUser,
  handleAnswerFromUser,
  addCandidateFromUser,
  sendLocationToAll,
  getConnectedPeerCount,
  closeAllPeerConnections
} from "../../services/friendTracker/webrtcService";
import {
  getGroupMembers,
  createGroup,
  sendJoinRequest,
  getPendingRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getGroupById
} from "../../services/friendTracker/apiService";

const CAMPUS_LAT = 6.91553;
const CAMPUS_LNG = 79.97326;

const CAMPUS_PLACES = [
  { id: "ground", name: "Ground", lat: 6.914413, lng: 79.97393, radius: 50 },
  { id: "outdoor1", name: "Wala", lat: 6.915174734754355, lng: 79.97349270630559, radius: 15 },
  { id: "building1", name: "New Building", lat: 6.9156706265126, lng: 79.97385568190947, radius: 40 },
  { id: "building2", name: "Main Building", lat: 6.91473152393306, lng: 79.97316639835009, radius: 15 },
  { id: "building3", name: "Engineering Building", lat: 6.916042312534343, lng: 79.973165302689, radius: 15 },
  { id: "building4", name: "Business Building", lat: 6.914261094114171, lng: 79.97335660627942, radius: 15 },
  { id: "building5", name: "William Anglis Building", lat: 6.9151687277045815, lng: 79.97465212743961, radius: 20 },
  { id: "canteen", name: "Anohana", lat: 6.914360972464267, lng: 79.97317942878938, radius: 12 },
  { id: "canteen2", name: "Basement Canteen", lat: 6.914892297182538, lng: 79.97325434918895, radius: 1 }
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

  html, body, #root {
    background: #060c18;
    margin: 0; padding: 0;
    min-height: 100vh;
  }
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --bg:        #060c18;
    --nav:       #080f1e;
    --surface:   #0c1a2e;
    --surface2:  #0f2040;
    --surface3:  #122448;
    --border:    rgba(56,189,248,0.10);
    --border-hi: rgba(56,189,248,0.32);
    --accent:    #38bdf8;
    --indigo:    #818cf8;
    --green:     #34d399;
    --amber:     #fbbf24;
    --red:       #f87171;
    --text:      #e2e8f0;
    --dim:       #94a3b8;
    --muted:     #475569;
    --glow-b:    0 0 24px rgba(56,189,248,0.18);
  }

  .ft-nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--nav);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
  }
  .ft-nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 24px;
    display: flex; align-items: center;
    height: 60px; gap: 0;
  }
  .ft-nav-brand {
    display: flex; align-items: center; gap: 10px;
    margin-right: 32px; flex-shrink: 0;
  }
  .ft-nav-logo {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), var(--indigo));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 16px rgba(56,189,248,0.35);
  }
  .ft-nav-title {
    font-family: 'Space Mono', monospace;
    font-size: 14px; font-weight: 700;
    background: linear-gradient(90deg, var(--accent), var(--indigo));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; white-space: nowrap;
  }
  .ft-nav-tabs { display: flex; align-items: center; gap: 2px; flex: 1; }
  .ft-nav-tab {
    padding: 6px 16px; border: none; border-radius: 8px;
    background: transparent; color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
    display: flex; align-items: center; gap: 7px;
  }
  .ft-nav-tab:hover { background: var(--surface2); color: var(--dim); }
  .ft-nav-tab.active { background: var(--surface2); color: var(--accent); box-shadow: inset 0 -2px 0 var(--accent); }
  .ft-nav-badge {
    background: var(--indigo); color: #fff;
    font-size: 10px; font-weight: 700;
    padding: 1px 6px; border-radius: 20px;
    font-family: 'Space Mono', monospace;
  }
  .ft-nav-status { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .ft-nav-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 6px var(--green);
    animation: pulse 2s infinite;
  }
  .ft-nav-status-dot.offline { background: var(--muted); box-shadow: none; animation: none; }
  .ft-nav-status-label { font-size: 12px; font-family: 'Space Mono', monospace; color: var(--dim); }

  .ft-page {
    max-width: 1200px; margin: 0 auto;
    padding: 28px 24px 60px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: calc(100vh - 60px);
  }
  .ft-page-header { margin-bottom: 26px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .ft-page-header h1 {
    font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700;
    margin: 0 0 6px;
    background: linear-gradient(90deg, var(--text) 50%, var(--dim));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ft-page-header p { margin: 0; font-size: 13.5px; color: var(--muted); line-height: 1.5; }

  .ft-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 26px 28px;
    transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 18px;
  }
  .ft-card:hover { border-color: var(--border-hi); box-shadow: var(--glow-b); }

  .ft-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
  @media (max-width: 720px) { .ft-grid2 { grid-template-columns: 1fr; } }

  .ft-sh { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
  .ft-sh-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .ft-sh h2 { margin: 0; font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; color: var(--accent); }
  .ft-sh-sub { margin-left: auto; font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }

  .ft-label { display: block; margin-bottom: 6px; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.9px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .ft-input, .ft-select {
    width: 100%; padding: 11px 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; outline: none; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 14px;
  }
  .ft-input::placeholder { color: var(--muted); }
  .ft-input:focus, .ft-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(56,189,248,0.1); }

  .ft-btn {
    padding: 10px 22px; border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; letter-spacing: 0.2px;
    transition: transform 0.1s, box-shadow 0.2s, opacity 0.15s;
    display: inline-flex; align-items: center; gap: 7px;
  }
  .ft-btn:active:not(:disabled) { transform: scale(0.97); }
  .ft-btn:disabled { opacity: 0.38; cursor: not-allowed; }
  .ft-btn-blue   { background: linear-gradient(135deg,var(--accent),#0ea5e9); color:#050d18; }
  .ft-btn-green  { background: linear-gradient(135deg,var(--green),#059669);  color:#050d18; }
  .ft-btn-indigo { background: linear-gradient(135deg,var(--indigo),#6d28d9); color:#fff; }
  .ft-btn-ghost  { background: var(--surface2); color: var(--dim); border: 1px solid var(--border); }
  .ft-btn-blue:not(:disabled):hover   { box-shadow: 0 0 18px rgba(56,189,248,0.4); }
  .ft-btn-green:not(:disabled):hover  { box-shadow: 0 0 18px rgba(52,211,153,0.4); }
  .ft-btn-indigo:not(:disabled):hover { box-shadow: 0 0 18px rgba(129,140,248,0.4); }
  .ft-btn-ghost:not(:disabled):hover  { border-color: var(--border-hi); color: var(--text); }
  .ft-btn-sm   { padding: 6px 14px; font-size: 12.5px; border-radius: 8px; }
  .ft-btn-full { width: 100%; justify-content: center; }
  .ft-btn-row  { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }

  .ft-status { display: flex; align-items: center; gap: 10px; padding: 11px 16px; margin-top: 16px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; }
  .ft-status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse 2s infinite; flex-shrink: 0; }
  .ft-status-dot.idle  { background:var(--muted); box-shadow:none; animation:none; }
  .ft-status-dot.error { background:var(--red);   box-shadow:0 0 6px var(--red); animation:none; }
  .ft-status-text { font-size:13px; font-family:'Space Mono',monospace; color:var(--dim); }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  .ft-error { font-size:12.5px; color:var(--red); margin:0 0 12px; display:flex; align-items:center; gap:6px; }
  .ft-divider { height: 1px; background: var(--border); margin: 20px 0; }

  .ft-stepper { display: flex; align-items: center; margin-bottom: 28px; }
  .ft-step { display: flex; align-items: center; gap: 10px; flex: 1; }
  .ft-step:last-child { flex: none; }
  .ft-step-num {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
    border: 2px solid var(--border); color: var(--muted);
    background: var(--surface2); flex-shrink: 0; transition: all 0.3s;
  }
  .ft-step-num.active { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 12px rgba(56,189,248,0.3); }
  .ft-step-num.done   { border-color: var(--green); background: var(--green); color: #050d18; }
  .ft-step-label { font-size: 12px; color: var(--muted); font-weight: 500; white-space: nowrap; }
  .ft-step-label.active { color: var(--text); }
  .ft-step-line { flex: 1; height: 1px; background: var(--border); margin: 0 8px; min-width: 16px; }
  .ft-step-line.done { background: var(--green); }

  .ft-group-banner {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(52,211,153,0.08), rgba(56,189,248,0.05));
    border: 1px solid rgba(52,211,153,0.22); border-radius: 12px; margin-bottom: 20px;
  }
  .ft-group-banner-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--green), #059669);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .ft-group-banner h3 { margin: 0 0 2px; font-size: 14px; font-weight: 600; }
  .ft-group-banner p  { margin: 0; font-size: 12px; color: var(--dim); font-family: 'Space Mono', monospace; }
  .ft-group-id-chip {
    margin-left: auto; flex-shrink: 0;
    padding: 5px 14px; border-radius: 20px;
    background: rgba(56,189,248,0.10); border: 1px solid rgba(56,189,248,0.22);
    font-family: 'Space Mono', monospace; font-size: 13px; color: var(--accent);
  }

  .ft-add-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;
    align-items: end;
    margin-bottom: 14px;
  }
  @media (max-width: 720px) {
    .ft-add-row { grid-template-columns: 1fr; }
  }

  .ft-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; min-height: 36px; }
  .ft-pill { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 20px; background: var(--surface2); border: 1px solid var(--border); font-size: 13px; color: var(--text); }
  .ft-pill-av { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg,var(--accent),var(--indigo)); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #050d18; font-family: 'Space Mono', monospace; flex-shrink: 0; }
  .ft-pill-rm { width: 16px; height: 16px; border-radius: 50%; background: var(--surface3); border: none; color: var(--muted); font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; padding: 0; }
  .ft-pill-rm:hover { background: rgba(248,113,113,0.18); color: var(--red); }

  .ft-coord-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
  .ft-coord-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
  .ft-coord-card .clabel { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 5px; font-family: 'Space Mono', monospace; }
  .ft-coord-card .cval { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--accent); }
  .ft-coord-card .cval.dim { color: var(--muted); font-size: 12px; }

  .ft-member-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-bottom: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; font-size: 13px; transition: border-color 0.15s; }
  .ft-member-item:hover { border-color: var(--border-hi); }
  .ft-member-left { display: flex; align-items: center; gap: 10px; }
  .ft-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,var(--accent),var(--indigo)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #050d18; font-family: 'Space Mono', monospace; flex-shrink: 0; }
  .ft-avatar.green { background: linear-gradient(135deg,var(--green),#059669); }
  .ft-role-badge { padding: 3px 10px; border-radius: 20px; font-size: 10.5px; font-family: 'Space Mono', monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
  .ft-role-badge.admin  { background: rgba(52,211,153,0.12); color: var(--green);  border: 1px solid rgba(52,211,153,0.22); }
  .ft-role-badge.member { background: rgba(56,189,248,0.10); color: var(--accent); border: 1px solid rgba(56,189,248,0.18); }

  .ft-req-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-bottom: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; gap: 8px; flex-wrap: wrap; transition: border-color 0.15s; }
  .ft-req-item:hover { border-color: var(--border-hi); }

  .ft-empty { text-align: center; padding: 36px 16px; color: var(--muted); font-size: 13px; font-family: 'Space Mono', monospace; }
  .ft-empty-icon { font-size: 32px; margin-bottom: 10px; }

  .ft-join-card { background: linear-gradient(135deg, rgba(129,140,248,0.07), rgba(56,189,248,0.03)); border: 1px solid rgba(129,140,248,0.18); border-radius: 18px; padding: 26px 28px; }

  .ft-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 14px;
  }

  .ft-notification-list {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ft-notification-item {
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
  }

  .ft-notification-time {
    font-size: 11px;
    color: var(--dim);
    font-family: 'Space Mono', monospace;
    margin-top: 4px;
  }
`;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function FriendTrackerPage() {
  const [activeTab, setActiveTab] = useState("groups");

  const [createStep, setCreateStep] = useState(1);
  const [newGroupName, setNewGroupName] = useState("");
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newEventRadius, setNewEventRadius] = useState("");

  const [createdGroupId, setCreatedGroupId] = useState(null);
  const [createdGroupName, setCreatedGroupName] = useState("");
  const [pendingMembers, setPendingMembers] = useState([]);
  const [friendUserIdInput, setFriendUserIdInput] = useState("");
  const [friendUserNameInput, setFriendUserNameInput] = useState("");
  const [createError, setCreateError] = useState("");

  const [joinGroupId, setJoinGroupId] = useState("");
  const [joinUserId, setJoinUserId] = useState("");
  const [joinUserName, setJoinUserName] = useState("");

  const [currentUserId, setCurrentUserId] = useState("");
  const [myLocation, setMyLocation] = useState(null);
  const [memberLocations, setMemberLocations] = useState({});
  const [connectedPeerCount, setConnectedPeerCount] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusMessage, setStatusMessage] = useState("Waiting for user action...");
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [membersLoaded, setMembersLoaded] = useState(false);

  const [eventCenter, setEventCenter] = useState(null);
  const [eventRadius, setEventRadius] = useState(null);

  const [friendSearch, setFriendSearch] = useState("");
  const [friendSearchMessage, setFriendSearchMessage] = useState("");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const selectedGroupRef = useRef("");
  const currentUserIdRef = useRef("");
  const membersRef = useRef([]);
  const previousPlaceStateRef = useRef({});

  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  const isGroupIdValid = useMemo(
    () => selectedGroup.trim() !== "" && /^\d+$/.test(selectedGroup.trim()),
    [selectedGroup]
  );

  function displayMemberName(member) {
    if (member?.userName && member.userName.trim()) return member.userName;
    if (member?.userId != null) return `User ${member.userId}`;
    return "Unknown User";
  }

  function displayInviteName(invite) {
    if (invite?.invitedUserName && invite.invitedUserName.trim()) return invite.invitedUserName;
    if (invite?.invitedUserId != null) return `User ${invite.invitedUserId}`;
    return "Unknown User";
  }

  function getAvatarText(name, id) {
    if (name && name.trim()) return name.trim().slice(0, 2).toUpperCase();
    if (id != null) return String(id).slice(-2);
    return "??";
  }

  function sendSignalToUser(targetUserId, payload) {
    sendMessage({
      type: payload.type,
      groupId: Number(selectedGroupRef.current),
      fromUserId: Number(currentUserIdRef.current),
      toUserId: Number(targetUserId),
      data: payload.data
    });
  }

  function refreshConnectedPeerCount() {
    setConnectedPeerCount(getConnectedPeerCount());
  }

  function addNotification(message, placeName, remoteUserId) {
    const item = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      placeName,
      remoteUserId,
      createdAt: new Date().toLocaleTimeString()
    };

    setNotifications((prev) => [item, ...prev].slice(0, 10));
  }

  function checkPlaceNotifications(remoteUserId, loc, remoteUserName) {
    if (!notificationsEnabled) return;

    if (!previousPlaceStateRef.current[remoteUserId]) {
      previousPlaceStateRef.current[remoteUserId] = {};
    }

    CAMPUS_PLACES.forEach((place) => {
      if (selectedPlaceId !== "all" && selectedPlaceId !== place.id) {
        return;
      }

      const distance = getDistance(
        loc.lat,
        loc.lng,
        place.lat,
        place.lng
      );

      const isInside = distance <= place.radius;
      const wasInside = previousPlaceStateRef.current[remoteUserId][place.id] ?? false;

      if (!wasInside && isInside) {
        addNotification(
          `${remoteUserName} entered ${place.name}`,
          place.name,
          remoteUserId
        );
      }

      if (wasInside && !isInside) {
        addNotification(
          `${remoteUserName} left ${place.name}`,
          place.name,
          remoteUserId
        );
      }

      previousPlaceStateRef.current[remoteUserId][place.id] = isInside;
    });
  }

  function handleSignalMessage(msg) {
  console.log("Signal received:", msg);

  if (msg.type === "online-users") {
    const onlineUsers = Array.isArray(msg.data) ? msg.data : [];

    onlineUsers.forEach((remoteUserId) => {
      const localId = Number(currentUserIdRef.current);
      const remoteId = Number(remoteUserId);

      if (remoteId === localId) return;

      // create only once, and only one side creates offer
      if (!hasPeerConnection(remoteId) && localId < remoteId) {
        createOfferForUser(remoteId, sendSignalToUser);
      }
    });

    setTimeout(() => {
      setConnectedPeerCount(getConnectedPeerCount());
    }, 300);

    return;
  }

  if (msg.type === "user-joined") {
    if (!msg.groupId || String(msg.groupId) !== String(selectedGroupRef.current)) {
      return;
    }

    const localId = Number(currentUserIdRef.current);
    const remoteId = Number(msg.data ?? msg.fromUserId);

    if (remoteId === localId) return;

    // create only once, and only one side creates offer
    if (!hasPeerConnection(remoteId) && localId < remoteId) {
      createOfferForUser(remoteId, sendSignalToUser);
      setStatusMessage(`User ${remoteId} joined. Negotiating...`);
    }

    setTimeout(() => {
      setConnectedPeerCount(getConnectedPeerCount());
    }, 300);

    return;
  }

  if (msg.type === "user-left") {
    if (!msg.groupId || String(msg.groupId) !== String(selectedGroupRef.current)) {
      return;
    }

    const remoteId = Number(msg.data ?? msg.fromUserId);

    setMemberLocations((prev) => {
      const updated = { ...prev };
      delete updated[remoteId];
      return updated;
    });

    setStatusMessage(`User ${remoteId} left the group.`);

    setTimeout(() => {
      setConnectedPeerCount(getConnectedPeerCount());
    }, 300);

    return;
  }

  if (!msg.groupId || String(msg.groupId) !== String(selectedGroupRef.current)) {
    return;
  }

  if (Number(msg.fromUserId) === Number(currentUserIdRef.current)) {
    return;
  }

  if (msg.type === "offer") {
    handleOfferFromUser(msg.fromUserId, msg.data, sendSignalToUser);
    setStatusMessage(`Offer received from user ${msg.fromUserId}. Negotiating...`);

    setTimeout(() => {
      setConnectedPeerCount(getConnectedPeerCount());
    }, 300);

    return;
  }

  if (msg.type === "answer") {
    handleAnswerFromUser(msg.fromUserId, msg.data);
    setConnectionStarted(true);
    setStatusMessage(`Answer received from user ${msg.fromUserId}.`);

    setTimeout(() => {
      setConnectedPeerCount(getConnectedPeerCount());
    }, 300);

    return;
  }

  if (msg.type === "candidate") {
    addCandidateFromUser(msg.fromUserId, msg.data);

    setTimeout(() => {
      setConnectedPeerCount(getConnectedPeerCount());
    }, 300);
  }
}

  useEffect(() => {
    connectSocket(handleSignalMessage);

    initializeWebRTC((remoteUserId, loc) => {
      const matchingMember = membersRef.current.find(
        (m) => Number(m.userId) === Number(remoteUserId)
      );

      const remoteUserName = matchingMember?.userName || `User ${remoteUserId}`;

      setMemberLocations((prev) => ({
        ...prev,
        [remoteUserId]: {
          ...loc,
          userId: remoteUserId,
          userName: remoteUserName
        }
      }));

      checkPlaceNotifications(remoteUserId, loc, remoteUserName);

      setConnectionStarted(true);
      setStatusMessage("Live group tracking active.");
      refreshConnectedPeerCount();
    });

    let watchId = null;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setMyLocation(loc);
          sendLocationToAll(loc.lat, loc.lng);
        },
        (err) => {
          console.error(err);
          setStatusMessage("Unable to get location.");
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
    } else {
      setStatusMessage("Geolocation not supported.");
    }

    return () => {
      closeAllPeerConnections();
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [notificationsEnabled, selectedPlaceId]);

  async function handleCreateGroupStep1() {
    const groupNameValue = newGroupName.trim();
    const adminIdValue = newAdminId.trim();
    const adminNameValue = newAdminName.trim();
    const radiusValue = newEventRadius.trim();

    if (!groupNameValue) {
      setCreateError("Group name is required.");
      return;
    }

    if (!adminIdValue || !/^\d+$/.test(adminIdValue)) {
      setCreateError("Valid admin user ID is required.");
      return;
    }

    if (!adminNameValue) {
      setCreateError("Admin name is required.");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(adminNameValue)) {
      setCreateError("Admin name must contain letters only.");
      return;
    }

    if (!radiusValue || isNaN(Number(radiusValue)) || Number(radiusValue) <= 0) {
      setCreateError("Valid event radius is required.");
      return;
    }

    setCreateError("");

    try {
      const created = await createGroup({
        name: groupNameValue,
        createdBy: Number(adminIdValue),
        adminName: adminNameValue,
        eventLatitude: CAMPUS_LAT,
        eventLongitude: CAMPUS_LNG,
        eventRadius: Number(radiusValue)
      });

      setCreatedGroupId(created.id);
      setCreatedGroupName(groupNameValue);
      setCreateStep(2);
    } catch (e) {
      console.error(e);
      setCreateError("Failed to create group. Try again.");
    }
  }

  async function handleAddMember() {
    const trimmedName = friendUserNameInput.trim();
    const trimmedId = friendUserIdInput.trim();

    if (!trimmedId) {
      setCreateError("Friend user ID is required.");
      return;
    }

    if (!/^\d+$/.test(trimmedId)) {
      setCreateError("Friend user ID must be numeric.");
      return;
    }

    if (!trimmedName) {
      setCreateError("Friend user name is required.");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(trimmedName)) {
      setCreateError("Friend name must contain letters only.");
      return;
    }

    const userIdValue = Number(trimmedId);

    const alreadyExists = pendingMembers.some((m) => {
      const sameId = m.userId != null && Number(m.userId) === userIdValue;
      const sameName =
        m.userName &&
        m.userName.toLowerCase().trim() === trimmedName.toLowerCase().trim();
      return sameId || sameName;
    });

    if (alreadyExists) {
      setCreateError("This friend is already added.");
      return;
    }

    setCreateError("");

    try {
      await sendJoinRequest({
        groupId: createdGroupId,
        invitedUserId: userIdValue,
        invitedUserName: trimmedName,
        invitedBy: Number(newAdminId),
        invitedByName: newAdminName.trim()
      });

      setPendingMembers((prev) => [
        ...prev,
        {
          userId: userIdValue,
          userName: trimmedName
        }
      ]);

      setFriendUserIdInput("");
      setFriendUserNameInput("");
    } catch (e) {
      console.error(e);
      setCreateError("Failed to invite this friend.");
    }
  }

  function handleFinishGroup() {
    setCreateStep(3);
  }

  function handleResetCreate() {
    setCreateStep(1);
    setNewGroupName("");
    setNewAdminId("");
    setNewAdminName("");
    setNewEventRadius("");
    setCreatedGroupId(null);
    setCreatedGroupName("");
    setPendingMembers([]);
    setFriendUserIdInput("");
    setFriendUserNameInput("");
    setCreateError("");
  }

  async function handleSendJoinRequest() {
    if (!joinGroupId.trim()) {
      setStatusMessage("Group ID is required.");
      return;
    }

    if (!joinUserId.trim()) {
      setStatusMessage("User ID is required.");
      return;
    }

    if (!/^\d+$/.test(joinUserId.trim())) {
      setStatusMessage("User ID must be numeric.");
      return;
    }

    if (!joinUserName.trim()) {
      setStatusMessage("User name is required.");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(joinUserName.trim())) {
      setStatusMessage("User name must contain letters only.");
      return;
    }

    try {
      await sendJoinRequest({
        groupId: Number(joinGroupId),
        invitedUserId: Number(joinUserId),
        invitedUserName: joinUserName.trim(),
        invitedBy: Number(joinUserId),
        invitedByName: joinUserName.trim()
      });

      setStatusMessage("Join request sent.");
      setJoinGroupId("");
      setJoinUserId("");
      setJoinUserName("");
    } catch (e) {
      console.error(e);
      setStatusMessage("Failed to send join request.");
    }
  }

  function validateGroupInput() {
    if (!selectedGroup.trim()) {
      setFormError("Group ID is required.");
      return false;
    }
    if (!/^\d+$/.test(selectedGroup.trim())) {
      setFormError("Group ID must be a number.");
      return false;
    }
    setFormError("");
    return true;
  }

  function handleGroupChange(value) {
    setSelectedGroup(value);
    setMembers([]);
    setPendingRequests([]);
    setMembersLoaded(false);
    setConnectionStarted(false);
    setMemberLocations({});
    setConnectedPeerCount(0);
    setNotifications([]);
    previousPlaceStateRef.current = {};
    setStatusMessage("Waiting for user action...");
    setFormError("");
    setEventCenter(null);
    setEventRadius(null);
    setFriendSearch("");
    setFriendSearchMessage("");
  }

  async function loadMembers() {
    if (!validateGroupInput()) return;

    try {
      setLoadingMembers(true);
      setStatusMessage("Loading group data...");
      setMembers([]);
      setMembersLoaded(false);
      setConnectionStarted(false);
      setMemberLocations({});
      setConnectedPeerCount(0);
      setNotifications([]);
      previousPlaceStateRef.current = {};
      setEventCenter(null);
      setEventRadius(null);
      setFriendSearchMessage("");

      const [groupData, memberData] = await Promise.all([
        getGroupById(selectedGroup),
        getGroupMembers(selectedGroup)
      ]);

      setMembers(memberData);

      if (
        groupData?.eventLatitude != null &&
        groupData?.eventLongitude != null &&
        groupData?.eventRadius != null
      ) {
        setEventCenter({
          lat: Number(groupData.eventLatitude),
          lng: Number(groupData.eventLongitude)
        });
        setEventRadius(Number(groupData.eventRadius));
      }

      if (memberData.length === 0) {
        setStatusMessage("No members found.");
        setMembersLoaded(false);
      } else {
        setStatusMessage("Members + event boundary loaded.");
        setMembersLoaded(true);
      }
    } catch (e) {
      console.error(e);
      setStatusMessage("Failed to load group data.");
      setMembersLoaded(false);
      setEventCenter(null);
      setEventRadius(null);
    } finally {
      setLoadingMembers(false);
    }
  }

  function handleSearchFriend() {
    const query = friendSearch.trim().toLowerCase();

    if (!query) {
      setFriendSearchMessage("");
      return;
    }

    const found = uniqueMembers.find((m) => {
      const nameMatch = m.userName?.toLowerCase().includes(query);
      const idMatch = m.userId != null && String(m.userId).includes(query);
      return nameMatch || idMatch;
    });

    if (!found) {
      setFriendSearchMessage("Friend is not in the group.");
      return;
    }

    setFriendSearchMessage(`Found: ${displayMemberName(found)}`);
  }

  function startConnection() {
    if (!validateGroupInput()) return;

    if (!membersLoaded || members.length === 0) {
      setStatusMessage("Load a valid group first.");
      return;
    }

    if (!currentUserId.trim() || !/^\d+$/.test(currentUserId.trim())) {
      setStatusMessage("Enter a valid current user ID first.");
      return;
    }

    joinGroup(Number(selectedGroup), Number(currentUserId));
    setStatusMessage("Joined signaling group. Waiting for peer negotiation...");
  }

  async function loadPendingRequests() {
    if (!validateGroupInput()) return;

    try {
      setLoadingRequests(true);
      const data = await getPendingRequests(selectedGroup);
      setPendingRequests(data);
      setStatusMessage("Requests loaded.");
    } catch (e) {
      console.error(e);
      setStatusMessage("Failed to load requests.");
    } finally {
      setLoadingRequests(false);
    }
  }

  async function handleAcceptRequest(inviteId) {
    try {
      await acceptJoinRequest(inviteId);
      setStatusMessage("Request accepted.");
      await loadPendingRequests();
      await loadMembers();
    } catch (e) {
      console.error(e);
      setStatusMessage("Failed to accept request.");
    }
  }

  async function handleRejectRequest(inviteId) {
    try {
      await rejectJoinRequest(inviteId);
      setStatusMessage("Request rejected.");
      await loadPendingRequests();
    } catch (e) {
      console.error(e);
      setStatusMessage("Failed to reject request.");
    }
  }

  const isActive = ["active", "loaded", "established", "accepted", "sent", "negotiating", "joined"].some((w) =>
    statusMessage.toLowerCase().includes(w)
  );

  const isError = ["fail", "unable", "not supported"].some((w) =>
    statusMessage.toLowerCase().includes(w)
  );

  const uniqueMembers = members.filter(
    (m, i, s) =>
      i ===
      s.findIndex(
        (x) =>
          (x.userId ?? null) === (m.userId ?? null) &&
          (x.userName ?? "").toLowerCase() === (m.userName ?? "").toLowerCase()
      )
  );

  return (
    <>
      <style>{styles}</style>

      <nav className="ft-nav">
        <div className="ft-nav-inner">
          <div className="ft-nav-brand">
            <div className="ft-nav-logo">📡</div>
            <span className="ft-nav-title">Friend Tracker & Notification System</span>
          </div>

          <div className="ft-nav-tabs">
            {[
              { id: "groups", icon: "👥", label: "Groups" },
              { id: "tracker", icon: "📍", label: "Live Tracker" },
              { id: "admin", icon: "🛡️", label: "Admin", badge: pendingRequests.length || null }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`ft-nav-tab${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.badge ? <span className="ft-nav-badge">{tab.badge}</span> : null}
              </button>
            ))}
          </div>

          <div className="ft-nav-status">
            <div className={`ft-nav-status-dot${myLocation ? "" : " offline"}`} />
            <span className="ft-nav-status-label">{myLocation ? "GPS Active" : "No GPS"}</span>
          </div>
        </div>
      </nav>

      <div className="ft-page">
        {activeTab === "groups" && (
          <>
            <div className="ft-page-header">
              <h1>Group Management</h1>
              <p>Create a new group, invite friends, and prepare tracking + notification alerts.</p>
            </div>

            <div className="ft-grid2">
              <div className="ft-card" style={{ marginBottom: 0 }}>
                <div className="ft-sh">
                  <div className="ft-sh-dot" style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
                  <h2 style={{ color: "var(--green)" }}>Create Group</h2>
                </div>

                <div className="ft-stepper">
                  {["Details", "Friends", "Done"].map((label, i) => {
                    const num = i + 1;
                    const isDone = createStep > num;
                    const isAct = createStep === num;

                    return (
                      <div key={label} className="ft-step" style={i === 2 ? { flex: "none" } : {}}>
                        <div className={`ft-step-num${isDone ? " done" : isAct ? " active" : ""}`}>
                          {isDone ? "✓" : num}
                        </div>
                        <span className={`ft-step-label${isAct ? " active" : ""}`}>{label}</span>
                        {i < 2 && <div className={`ft-step-line${isDone ? " done" : ""}`} />}
                      </div>
                    );
                  })}
                </div>

                {createError && <p className="ft-error">⚠ {createError}</p>}

                {createStep === 1 && (
                  <>
                    <label className="ft-label">Group Name</label>
                    <input className="ft-input" placeholder="e.g. Concert Night Squad" value={newGroupName} onChange={(e) => { setNewGroupName(e.target.value); setCreateError(""); }} />

                    <label className="ft-label">Admin User ID</label>
                    <input className="ft-input" type="number" placeholder="Admin user ID" value={newAdminId} onChange={(e) => { setNewAdminId(e.target.value); setCreateError(""); }} />

                    <label className="ft-label">Admin Name</label>
                    <input className="ft-input" type="text" placeholder="Admin name" value={newAdminName} onChange={(e) => { setNewAdminName(e.target.value); setCreateError(""); }} />

                    <label className="ft-label">Event Radius (meters)</label>
                    <input className="ft-input" type="number" placeholder="e.g. 500" value={newEventRadius} onChange={(e) => { setNewEventRadius(e.target.value); setCreateError(""); }} />

                    <div style={{ marginBottom: "14px", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--surface2)", fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "var(--dim)" }}>
                      Campus Center: {CAMPUS_LAT}, {CAMPUS_LNG}
                    </div>

                    <button className="ft-btn ft-btn-green ft-btn-full" onClick={handleCreateGroupStep1}>
                      Create Group →
                    </button>
                  </>
                )}

                {createStep === 2 && (
                  <>
                    <div className="ft-group-banner">
                      <div className="ft-group-banner-icon">🎉</div>
                      <div>
                        <h3>{createdGroupName}</h3>
                        <p>Add members for tracking and notifications</p>
                      </div>
                      <div className="ft-group-id-chip">ID: {createdGroupId}</div>
                    </div>

                    <label className="ft-label">Add Friend</label>
                    <div className="ft-add-row">
                      <input className="ft-input" type="number" placeholder="Friend User ID" value={friendUserIdInput} onChange={(e) => { setFriendUserIdInput(e.target.value); setCreateError(""); }} />
                      <input className="ft-input" type="text" placeholder="Friend Name" value={friendUserNameInput} onChange={(e) => { setFriendUserNameInput(e.target.value); setCreateError(""); }} onKeyDown={(e) => e.key === "Enter" && handleAddMember()} />
                      <button className="ft-btn ft-btn-blue ft-btn-sm" onClick={handleAddMember} style={{ marginBottom: 14, flexShrink: 0 }}>
                        + Add
                      </button>
                    </div>

                    {pendingMembers.length > 0 && (
                      <>
                        <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.9px", marginBottom: "8px" }}>
                          Added Friends ({pendingMembers.length})
                        </div>
                        <div className="ft-pills">
                          {pendingMembers.map((m, index) => (
                            <div key={`${m.userId}-${m.userName}-${index}`} className="ft-pill">
                              <div className="ft-pill-av">{getAvatarText(m.userName, m.userId)}</div>
                              {m.userName} ({m.userId})
                              <button className="ft-pill-rm" onClick={() => setPendingMembers((prev) => prev.filter((_, i) => i !== index))}>
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {pendingMembers.length === 0 && (
                      <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
                        No friends added yet.
                      </p>
                    )}

                    <div className="ft-btn-row">
                      <button className="ft-btn ft-btn-green" onClick={handleFinishGroup}>✓ Finish</button>
                    </div>
                  </>
                )}

                {createStep === 3 && (
                  <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "16px", color: "var(--green)", marginBottom: "6px" }}>
                      {createdGroupName}
                    </div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "12px", color: "var(--dim)", marginBottom: "4px" }}>
                      Group ID: <span style={{ color: "var(--accent)" }}>{createdGroupId}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px" }}>
                      {pendingMembers.length} friend invite{pendingMembers.length !== 1 ? "s" : ""} sent
                    </div>
                    <div className="ft-btn-row" style={{ justifyContent: "center" }}>
                      <button
                        className="ft-btn ft-btn-blue ft-btn-sm"
                        onClick={() => {
                          setSelectedGroup(String(createdGroupId));
                          setCurrentUserId(String(newAdminId));
                          setActiveTab("tracker");
                        }}
                      >
                        📍 Open in Tracker
                      </button>
                      <button className="ft-btn ft-btn-ghost ft-btn-sm" onClick={handleResetCreate}>
                        + New Group
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="ft-join-card" style={{ marginBottom: 0 }}>
                <div className="ft-sh">
                  <div className="ft-sh-dot" style={{ background: "var(--indigo)", boxShadow: "0 0 8px var(--indigo)" }} />
                  <h2 style={{ color: "var(--indigo)" }}>Request to Join</h2>
                </div>

                <p style={{ margin: "0 0 22px", fontSize: "13.5px", color: "var(--dim)", lineHeight: 1.6 }}>
                  User ID and user name are both required to join.
                </p>

                <label className="ft-label">Group ID</label>
                <input className="ft-input" type="number" placeholder="Enter group ID" value={joinGroupId} onChange={(e) => setJoinGroupId(e.target.value)} />

                <label className="ft-label">Your User ID</label>
                <input className="ft-input" type="number" placeholder="Enter your user ID" value={joinUserId} onChange={(e) => setJoinUserId(e.target.value)} />

                <label className="ft-label">Your Name</label>
                <input className="ft-input" type="text" placeholder="Enter your name" value={joinUserName} onChange={(e) => setJoinUserName(e.target.value)} />

                <button className="ft-btn ft-btn-indigo ft-btn-full" onClick={handleSendJoinRequest} disabled={!joinGroupId.trim() || !joinUserId.trim() || !joinUserName.trim()}>
                  → Send Join Request
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "tracker" && (
          <>
            <div className="ft-page-header">
              <h1>Live Tracker & Notifications</h1>
              <p>Track group members in real time and receive campus place notifications.</p>
            </div>

            <div className="ft-card">
              <div className="ft-sh">
                <div className="ft-sh-dot" />
                <h2>Group Connection</h2>
              </div>

              <label className="ft-label">Group ID</label>
              <input className="ft-input" type="text" value={selectedGroup} onChange={(e) => handleGroupChange(e.target.value)} placeholder="Enter numeric group ID" style={{ maxWidth: "320px" }} />

              <label className="ft-label">Current User ID</label>
              <input className="ft-input" type="number" value={currentUserId} onChange={(e) => setCurrentUserId(e.target.value)} placeholder="Enter your own user ID" style={{ maxWidth: "320px" }} />

              {formError && <p className="ft-error">⚠ {formError}</p>}

              <div className="ft-btn-row">
                <button className="ft-btn ft-btn-blue" onClick={loadMembers} disabled={loadingMembers}>
                  {loadingMembers ? "⏳ Loading..." : "Load Members"}
                </button>
                <button className="ft-btn ft-btn-green" onClick={startConnection} disabled={!isGroupIdValid || !membersLoaded}>
                  {connectionStarted ? "✓ P2P Active" : "⚡ Start P2P"}
                </button>
              </div>

              <div className="ft-status">
                <div className={`ft-status-dot${isError ? " error" : isActive ? "" : " idle"}`} />
                <span className="ft-status-text">{statusMessage}</span>
              </div>
            </div>

            <div className="ft-grid2">
              <div className="ft-card" style={{ marginBottom: 0 }}>
                <div className="ft-sh">
                  <div className="ft-sh-dot" style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
                  <h2 style={{ color: "var(--green)" }}>Members</h2>
                  {uniqueMembers.length > 0 && <span className="ft-sh-sub">{uniqueMembers.length} total</span>}
                </div>

                <label className="ft-label">Search Friend by Name or ID</label>
                <input
                  className="ft-input"
                  type="text"
                  placeholder="e.g. Anisha or 12"
                  value={friendSearch}
                  onChange={(e) => {
                    setFriendSearch(e.target.value);
                    setFriendSearchMessage("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchFriend()}
                />

                <div className="ft-btn-row" style={{ marginTop: 0, marginBottom: "14px" }}>
                  <button className="ft-btn ft-btn-indigo ft-btn-sm" onClick={handleSearchFriend}>
                    Search Friend
                  </button>
                </div>

                {friendSearchMessage && (
                  <p
                    className={friendSearchMessage === "Friend is not in the group." ? "ft-error" : ""}
                    style={
                      friendSearchMessage === "Friend is not in the group."
                        ? undefined
                        : { fontSize: "12.5px", color: "var(--green)", margin: "0 0 14px" }
                    }
                  >
                    {friendSearchMessage === "Friend is not in the group." ? "⚠ " : ""}
                    {friendSearchMessage}
                  </p>
                )}

                {uniqueMembers.length === 0 ? (
                  <div className="ft-empty">
                    <div className="ft-empty-icon">👥</div>
                    Load a group to see members
                  </div>
                ) : (
                  uniqueMembers.map((m, index) => (
                    <div key={`${m.userId ?? "n"}-${m.userName ?? "name"}-${index}`} className="ft-member-item">
                      <div className="ft-member-left">
                        <div className={`ft-avatar${String(m.role).toLowerCase() === "admin" ? " green" : ""}`}>
                          {getAvatarText(m.userName, m.userId)}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>
                            {displayMemberName(m)}
                          </div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", color: "var(--dim)" }}>
                            {m.userId != null ? `ID: ${m.userId}` : "No user ID"}
                          </div>
                        </div>
                      </div>
                      <span className={`ft-role-badge ${String(m.role).toLowerCase() === "admin" ? "admin" : "member"}`}>
                        {m.role}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="ft-card" style={{ marginBottom: 0 }}>
                <div className="ft-sh">
                  <div className="ft-sh-dot" />
                  <h2>Tracking & Notification Settings</h2>
                </div>

                <div className="ft-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>Enable Place Notifications</div>
                    <div style={{ fontSize: "12px", color: "var(--dim)" }}>
                      Get alerts when friends enter or leave campus locations
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                </div>

                <label className="ft-label">Notification Place Filter</label>
                <select
                  className="ft-select"
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                >
                  <option value="all">All Campus Places</option>
                  {CAMPUS_PLACES.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name}
                    </option>
                  ))}
                </select>

                <div className="ft-coord-grid">
                  <div className="ft-coord-card">
                    <div className="clabel">🔵 My Location</div>
                    <div className={`cval${!myLocation ? " dim" : ""}`}>
                      {myLocation ? `${myLocation.lat.toFixed(5)}, ${myLocation.lng.toFixed(5)}` : "Acquiring..."}
                    </div>
                  </div>

                  <div className="ft-coord-card">
                    <div className="clabel">🔴 Group Members Live</div>
                    <div className={`cval${connectedPeerCount === 0 ? " dim" : ""}`}>
                      {connectedPeerCount > 0
                        ? `${connectedPeerCount} member(s) connected`
                        : connectionStarted
                        ? "Waiting..."
                        : "Start P2P"}
                    </div>
                  </div>
                </div>

                {eventCenter && eventRadius && (
                  <div
                    style={{
                      marginBottom: "12px",
                      padding: "10px",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      background: "var(--surface2)",
                      fontSize: "12px",
                      fontFamily: "'Space Mono', monospace"
                    }}
                  >
                    Event Center: {eventCenter.lat.toFixed(4)}, {eventCenter.lng.toFixed(4)}
                    <br />
                    Radius: {eventRadius} m
                  </div>
                )}

                <MapView
                  myLocation={myLocation}
                  memberLocations={memberLocations}
                  eventCenter={eventCenter}
                  eventRadius={eventRadius}
                />

                <div className="ft-notification-list">
                  <div className="ft-sh" style={{ marginTop: "16px", marginBottom: "10px" }}>
                    <div className="ft-sh-dot" style={{ background: "var(--amber)", boxShadow: "0 0 8px var(--amber)" }} />
                    <h2 style={{ color: "var(--amber)" }}>Place Notifications</h2>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="ft-empty" style={{ padding: "20px 12px" }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div key={item.id} className="ft-notification-item">
                        <div style={{ fontWeight: 600 }}>{item.message}</div>
                        <div className="ft-notification-time">{item.createdAt}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "admin" && (
          <>
            <div className="ft-page-header">
              <h1>Admin Panel</h1>
              <p>Review, approve, or reject pending join requests.</p>
            </div>

            <div className="ft-card">
              <div className="ft-sh">
                <div className="ft-sh-dot" style={{ background: "var(--indigo)", boxShadow: "0 0 8px var(--indigo)" }} />
                <h2 style={{ color: "var(--indigo)" }}>Pending Requests</h2>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "22px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label className="ft-label">Group ID</label>
                  <input className="ft-input" type="text" value={selectedGroup} onChange={(e) => handleGroupChange(e.target.value)} placeholder="Enter group ID" style={{ marginBottom: 0 }} />
                </div>

                <button className="ft-btn ft-btn-indigo" onClick={loadPendingRequests} disabled={loadingRequests} style={{ marginBottom: 0 }}>
                  {loadingRequests ? "⏳ Loading..." : "Load Requests"}
                </button>
              </div>

              {formError && <p className="ft-error">⚠ {formError}</p>}

              {pendingRequests.length === 0 ? (
                <div className="ft-empty">
                  <div className="ft-empty-icon">📭</div>
                  No pending requests
                </div>
              ) : (
                pendingRequests.map((req, index) => (
                  <div key={`${req.id}-${index}`} className="ft-req-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        className="ft-avatar"
                        style={{
                          background: "linear-gradient(135deg,var(--indigo),#6d28d9)",
                          color: "#fff",
                          fontSize: "11px"
                        }}
                      >
                        {getAvatarText(req.invitedUserName, req.invitedUserId)}
                      </div>

                      <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "11.5px", color: "var(--dim)" }}>
                          Request <span style={{ color: "var(--accent)" }}>#{req.id}</span>
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>
                          {displayInviteName(req)}
                        </div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", color: "var(--dim)" }}>
                          {req.invitedUserId != null ? `ID: ${req.invitedUserId}` : "No user ID"}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "10.5px",
                          fontFamily: "'Space Mono',monospace",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: "rgba(251,191,36,0.12)",
                          color: "var(--amber)",
                          border: "1px solid rgba(251,191,36,0.25)"
                        }}
                      >
                        {req.status}
                      </span>

                      <button className="ft-btn ft-btn-green ft-btn-sm" onClick={() => handleAcceptRequest(req.id)}>
                        ✓ Accept
                      </button>

                      <button
                        className="ft-btn ft-btn-sm"
                        onClick={() => handleRejectRequest(req.id)}
                        style={{
                          background: "rgba(248,113,113,0.12)",
                          color: "var(--red)",
                          border: "1px solid rgba(248,113,113,0.25)"
                        }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FriendTrackerPage;