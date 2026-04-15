import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./artistModule.css";

function ArtistModuleLayout({ title, subtitle, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="artist-module-page">
      <header className="artist-topbar">
        
      </header>

      <div className="artist-topbar-glow" />

      <div className="artist-module-shell">
        <aside className={`artist-module-sidebar ${menuOpen ? "show" : ""}`}>
          <div className="artist-sidebar-panel">
            <div className="artist-sidebar-home-wrap">
              <NavLink to="/" className="artist-module-brand">
                HOME
              </NavLink>
            </div>

            <div className="artist-module-divider" />

            <div className="artist-module-group">
              <div className="artist-module-section-title">ORGANIZER TOOLS</div>
              <nav className="artist-module-nav">
                <NavLink to="/organizer/search-artists">Search Artists</NavLink>
                <NavLink to="/organizer/add-artist-lead">Add Artist Lead</NavLink>
                <NavLink to="/organizer/send-invitation">Send Invitation</NavLink>
                <NavLink to="/organizer/invitation-tracker">Invitation Tracker</NavLink>
              </nav>
            </div>

            <div className="artist-module-group">
              <div className="artist-module-section-title">EVENT DECISIONS</div>
              <nav className="artist-module-nav">
                <NavLink to="/organizer/vote-results">Vote Results</NavLink>
                <NavLink to="/organizer/finalize-artist">Finalize Artist</NavLink>
                <NavLink to="/organizer/calendar-status">Calendar Status</NavLink>
                <NavLink to="/organizer/history-logs">History Logs</NavLink>
              </nav>
            </div>

            <div className="artist-module-group">
              <div className="artist-module-section-title">STUDENT PAGES</div>
              <nav className="artist-module-nav">
                <NavLink to="/student/artist-shortlist">Artist Shortlist</NavLink>
                <NavLink to="/student/vote-artist">Vote Artist</NavLink>
              </nav>
            </div>
          </div>
        </aside>

        <main className="artist-module-main">
          <section className="artist-module-header modern">
            <div className="artist-module-badge">ARTIST MANAGEMENT</div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </section>

          <section className="artist-module-content">{children}</section>
        </main>
      </div>
    </div>
  );
}

export default ArtistModuleLayout;