const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const peerConnections = {};
const dataChannels = {};
const pendingCandidates = {};
let locationCallback = null;

function ensurePending(userId) {
  if (!pendingCandidates[userId]) {
    pendingCandidates[userId] = [];
  }
}

function setupDataChannel(remoteUserId, channel) {
  dataChannels[remoteUserId] = channel;

  channel.onopen = () => {
    console.log(`P2P DataChannel connected with user ${remoteUserId}`);
  };

  channel.onclose = () => {
    console.log(`P2P DataChannel closed with user ${remoteUserId}`);
  };

  channel.onerror = (error) => {
    console.error(`DataChannel error with user ${remoteUserId}:`, error);
  };

  channel.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "location" && locationCallback) {
        locationCallback(remoteUserId, {
          lat: data.lat,
          lng: data.lng,
          userId: remoteUserId
        });
      }
    } catch (error) {
      console.error("DataChannel message parse error:", error);
    }
  };
}

function setupPeerConnection(remoteUserId, sendSignal) {
  if (peerConnections[remoteUserId]) {
    return peerConnections[remoteUserId];
  }

  const pc = new RTCPeerConnection(configuration);
  peerConnections[remoteUserId] = pc;
  ensurePending(remoteUserId);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      sendSignal(remoteUserId, {
        type: "candidate",
        data: event.candidate
      });
    }
  };

  pc.ondatachannel = (event) => {
    setupDataChannel(remoteUserId, event.channel);
  };

  pc.onconnectionstatechange = () => {
    console.log(`Connection state with ${remoteUserId}:`, pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
    console.log(`ICE state with ${remoteUserId}:`, pc.iceConnectionState);
  };

  return pc;
}

export function initializeWebRTC(onLocationReceived) {
  locationCallback = onLocationReceived;
}

export function hasPeerConnection(remoteUserId) {
  return !!peerConnections[remoteUserId];
}

export function createPeerForRemoteUser(remoteUserId, sendSignal) {
  const pc = setupPeerConnection(remoteUserId, sendSignal);

  if (!dataChannels[remoteUserId]) {
    const channel = pc.createDataChannel(`location-${remoteUserId}`);
    setupDataChannel(remoteUserId, channel);
  }

  return pc;
}

export async function createOfferForUser(remoteUserId, sendSignal) {
  try {
    const pc = createPeerForRemoteUser(remoteUserId, sendSignal);

    if (pc.signalingState !== "stable") {
      console.log(`Skipping offer for ${remoteUserId}, state:`, pc.signalingState);
      return;
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendSignal(remoteUserId, {
      type: "offer",
      data: offer
    });
  } catch (error) {
    console.error(`createOfferForUser error (${remoteUserId}):`, error);
  }
}

export async function handleOfferFromUser(remoteUserId, offer, sendSignal) {
  try {
    const pc = setupPeerConnection(remoteUserId, sendSignal);

    if (pc.signalingState !== "stable") {
      console.log(`Ignoring offer from ${remoteUserId}, state:`, pc.signalingState);
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    await flushPendingCandidates(remoteUserId);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    sendSignal(remoteUserId, {
      type: "answer",
      data: answer
    });
  } catch (error) {
    console.error(`handleOfferFromUser error (${remoteUserId}):`, error);
  }
}

export async function handleAnswerFromUser(remoteUserId, answer) {
  try {
    const pc = peerConnections[remoteUserId];
    if (!pc) return;

    if (pc.signalingState !== "have-local-offer") {
      console.log(`Ignoring answer from ${remoteUserId}, state:`, pc.signalingState);
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    await flushPendingCandidates(remoteUserId);
  } catch (error) {
    console.error(`handleAnswerFromUser error (${remoteUserId}):`, error);
  }
}

export async function addCandidateFromUser(remoteUserId, candidate) {
  try {
    const pc = peerConnections[remoteUserId];
    ensurePending(remoteUserId);

    if (pc && pc.remoteDescription && pc.remoteDescription.type) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      pendingCandidates[remoteUserId].push(candidate);
    }
  } catch (error) {
    console.error(`ICE candidate error (${remoteUserId}):`, error);
  }
}

async function flushPendingCandidates(remoteUserId) {
  ensurePending(remoteUserId);

  while (pendingCandidates[remoteUserId].length > 0) {
    const candidate = pendingCandidates[remoteUserId].shift();
    const pc = peerConnections[remoteUserId];

    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
}

export function sendLocationToAll(lat, lng) {
  const payload = JSON.stringify({
    type: "location",
    lat,
    lng
  });

  Object.entries(dataChannels).forEach(([remoteUserId, channel]) => {
    if (channel && channel.readyState === "open") {
      console.log(`Sending location to ${remoteUserId}:`, { lat, lng });
      channel.send(payload);
    }
  });
}

export function getConnectedPeerCount() {
  return Object.values(dataChannels).filter(
    (channel) => channel && channel.readyState === "open"
  ).length;
}

export function removePeerConnection(remoteUserId) {
  try {
    if (dataChannels[remoteUserId]) {
      dataChannels[remoteUserId].close();
    }
  } catch (e) {
    console.error(`Error closing data channel for ${remoteUserId}:`, e);
  }

  try {
    if (peerConnections[remoteUserId]) {
      peerConnections[remoteUserId].close();
    }
  } catch (e) {
    console.error(`Error closing peer connection for ${remoteUserId}:`, e);
  }

  delete peerConnections[remoteUserId];
  delete dataChannels[remoteUserId];
  delete pendingCandidates[remoteUserId];
}

export function closeAllPeerConnections() {
  Object.keys(peerConnections).forEach((remoteUserId) => {
    removePeerConnection(remoteUserId);
  });
}