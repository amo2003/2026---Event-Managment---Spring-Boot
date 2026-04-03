import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

const blueIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

function MapView({ myLocation, memberLocations, eventCenter, eventRadius }) {
  if (!myLocation) {
    return (
      <div
        style={{
          height: "480px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          background: "var(--surface2)",
          color: "var(--text-muted)",
          gap: "12px"
        }}
      >
        <div style={{ fontSize: "36px" }}>🗺️</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
          Acquiring GPS signal...
        </div>
      </div>
    );
  }

  const remoteMembers = Object.values(memberLocations || {});

  const memberStatuses = remoteMembers.map((member) => {
    let status = "Unknown";

    if (eventCenter && eventRadius) {
      const distance = getDistance(
        member.lat,
        member.lng,
        eventCenter.lat,
        eventCenter.lng
      );

      status = distance <= eventRadius ? "Inside Radius" : "Outside Radius";
    }

    return {
      ...member,
      status
    };
  });

  return (
    <div>
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--border)"
        }}
      >
        <MapContainer
          center={[myLocation.lat, myLocation.lng]}
          zoom={15}
          style={{ height: "480px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {eventCenter && eventRadius && (
            <Circle
              center={[eventCenter.lat, eventCenter.lng]}
              radius={eventRadius}
            />
          )}

          <Marker position={[myLocation.lat, myLocation.lng]} icon={blueIcon}>
            <Popup>
              <strong>My Location</strong>
            </Popup>
          </Marker>

          {memberStatuses.map((member) => (
            <Marker
              key={member.userId}
              position={[member.lat, member.lng]}
              icon={redIcon}
            >
              <Popup>
                <strong>{member.userName || `User ${member.userId}`}</strong>
                <br />
                ID: {member.userId}
                <br />
                Lat: {member.lat.toFixed(5)}
                <br />
                Lng: {member.lng.toFixed(5)}
                <br />
                Status: {member.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "14px",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          background: "var(--surface2)"
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px",
            color: "var(--accent)",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          Member Radius Status
        </div>

        {memberStatuses.length === 0 ? (
          <div
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              fontFamily: "'Space Mono', monospace"
            }}
          >
            No connected members yet
          </div>
        ) : (
          memberStatuses.map((member) => (
            <div
              key={`status-${member.userId}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                marginBottom: "8px",
                borderRadius: "10px",
                background: "var(--surface3)",
                border: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>
                  {member.userName || `User ${member.userId}`}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--dim)",
                    fontFamily: "'Space Mono', monospace"
                  }}
                >
                  ID: {member.userId}
                </div>
              </div>

              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                  color:
                    member.status === "Inside Radius"
                      ? "var(--green)"
                      : "var(--red)",
                  border:
                    member.status === "Inside Radius"
                      ? "1px solid rgba(52,211,153,0.35)"
                      : "1px solid rgba(248,113,113,0.35)",
                  background:
                    member.status === "Inside Radius"
                      ? "rgba(52,211,153,0.10)"
                      : "rgba(248,113,113,0.10)"
                }}
              >
                {member.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MapView;