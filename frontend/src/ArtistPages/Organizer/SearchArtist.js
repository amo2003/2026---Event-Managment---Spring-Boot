import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import artistLeadService from "../../services/artistLeadService";
import artistService from "../../services/artistService";
import ArtistModuleLayout from "../ArtistModule/ArtistModuleLayout";
import "../../assets/artistModule.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeName(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function SearchArtist() {
  const [events, setEvents] = useState([]);
  const [registeredArtists, setRegisteredArtists] = useState([]);
  const [artistLeads, setArtistLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [eventsResponse, artistsResponse, leadsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/events"),
        artistService.getAllArtists(),
        artistLeadService.getAllLeads(),
      ]);

      const eventData = eventsResponse.data || [];
      const artistData = artistsResponse.data || [];
      const leadData = leadsResponse.data || [];

      const withArtists = eventData.filter(
        (event) => event.artists && event.artists.trim()
      );

      setEvents(withArtists);
      setRegisteredArtists(artistData);
      setArtistLeads(leadData);
    } catch (err) {
      console.error("Error fetching event artists:", err);
      setError("Failed to load event-wise artist data.");
      setEvents([]);
      setRegisteredArtists([]);
      setArtistLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedEventArtists = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const grouped = events.map((event) => {
      const names = event.artists
        ? event.artists.split(",").map((name) => name.trim()).filter(Boolean)
        : [];

      const artistsForEvent = names.map((name) => {
        const normalized = normalizeName(name);

        const registeredArtist = registeredArtists.find(
          (artist) => normalizeName(artist.artistName) === normalized
        );

        const leadArtist = artistLeads.find(
          (lead) => normalizeName(lead.artistName) === normalized
        );

        return {
          key: `${event.id}-${name}`,
          artistName: name,
          eventId: event.id,
          eventName: event.eventName,
          venue: event.venue,
          eventDate: event.eventDate,
          status: registeredArtist
            ? "REGISTERED"
            : leadArtist
            ? "LEAD_ADDED"
            : "NOT_FOUND",
          registeredArtist,
          leadArtist,
        };
      });

      const filteredArtists = artistsForEvent.filter((artist) => {
        if (!query) return true;

        return (
          artist.artistName.toLowerCase().includes(query) ||
          String(artist.status).toLowerCase().includes(query) ||
          String(
            artist.registeredArtist?.category || artist.leadArtist?.category || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            artist.registeredArtist?.email || artist.leadArtist?.email || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(event.eventName || "").toLowerCase().includes(query) ||
          String(event.venue || "").toLowerCase().includes(query)
        );
      });

      return {
        eventId: event.id,
        eventName: event.eventName,
        venue: event.venue,
        eventDate: event.eventDate,
        artists: filteredArtists,
      };
    });

    return grouped.filter((group) => group.artists.length > 0);
  }, [events, registeredArtists, artistLeads, searchTerm]);

  const totalResults = groupedEventArtists.reduce(
    (sum, group) => sum + group.artists.length,
    0
  );

  const getStatusBadge = (status) => {
    if (status === "REGISTERED") {
      return {
        text: "REGISTERED",
        style: {
          background: "rgba(16, 185, 129, 0.12)",
          color: "#34d399",
          border: "1px solid rgba(16, 185, 129, 0.28)",
        },
      };
    }

    if (status === "LEAD_ADDED") {
      return {
        text: "LEAD ADDED",
        style: {
          background: "rgba(245, 158, 11, 0.12)",
          color: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.28)",
        },
      };
    }

    return {
      text: "NOT FOUND",
      style: {
        background: "rgba(239, 68, 68, 0.12)",
        color: "#f87171",
        border: "1px solid rgba(239, 68, 68, 0.28)",
      },
    };
  };

  return (
    <ArtistModuleLayout
      title="Search Artists"
      subtitle="Browse artists grouped under each event based on the event artist list."
    >
      <div className="ah-search-bar">
        <input
          className="ah-search-input"
          type="text"
          placeholder="Search by artist, event, venue, category, email or status…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span style={{ fontSize: 12, color: "var(--ah-text-3)" }}>
          {totalResults} result{totalResults !== 1 ? "s" : ""}
        </span>
      </div>

      {error && <div className="ah-error">{error}</div>}

      {loading ? (
        <div className="ah-state">
          <div className="ah-state-icon">◌</div>
          Loading artists…
        </div>
      ) : groupedEventArtists.length === 0 ? (
        <div className="ah-state">
          <div className="ah-state-icon">⊘</div>
          No matching event artists found.
        </div>
      ) : (
        groupedEventArtists.map((group) => (
          <div key={group.eventId} className="ah-card" style={{ marginBottom: 18 }}>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--ah-text-3)",
                  marginBottom: 6,
                }}
              >
                Event
              </div>
              <div className="ah-card-title">{group.eventName}</div>
              <div style={{ fontSize: 12, color: "var(--ah-text-3)", marginTop: 4 }}>
                {group.venue} {group.eventDate ? `• ${group.eventDate}` : ""}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {group.artists.map((artist) => {
                const statusBadge = getStatusBadge(artist.status);
                const details = artist.registeredArtist || artist.leadArtist || {};

                return (
                  <div
                    key={artist.key}
                    className="ah-card"
                    style={{
                      padding: "14px 16px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div className="ah-artist-header">
                      <div className="ah-artist-avatar">
                        {getInitials(artist.artistName)}
                      </div>

                      <div>
                        <div className="ah-artist-name">{artist.artistName}</div>
                        <div className="ah-artist-category">
                          {details.category || "Category not available"}
                        </div>
                      </div>

                      <div style={{ marginLeft: "auto" }}>
                        <span
                          className="ah-badge"
                          style={statusBadge.style}
                        >
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px 20px",
                      }}
                    >
                      {details.email && (
                        <div className="ah-card-row">
                          <span className="ah-card-label">Email</span>
                          <span className="ah-card-value">{details.email}</span>
                        </div>
                      )}

                      {details.phoneNumber && (
                        <div className="ah-card-row">
                          <span className="ah-card-label">Phone</span>
                          <span className="ah-card-value">{details.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    {artist.status === "REGISTERED" && details.bio && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--ah-text-3)",
                          marginTop: 10,
                          lineHeight: 1.5,
                        }}
                      >
                        {details.bio}
                      </p>
                    )}

                    {artist.status === "LEAD_ADDED" && details.notes && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--ah-text-3)",
                          marginTop: 10,
                          lineHeight: 1.5,
                        }}
                      >
                        {details.notes}
                      </p>
                    )}

                    {artist.status === "NOT_FOUND" && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#f87171",
                          marginTop: 10,
                          lineHeight: 1.5,
                        }}
                      >
                        This artist is listed in the event, but no matching lead or registered artist was found yet.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </ArtistModuleLayout>
  );
}

export default SearchArtist;