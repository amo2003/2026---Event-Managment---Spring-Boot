import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/artistModule.css";

function ArtistModuleLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <div className="artist-module-page">

      <div className="artist-module-shell">
        <aside className="artist-module-sidebar">
          <div className="artist-module-brand">Artist Hub</div>

          <div className="artist-module-section-title">Organizer</div>
          <nav className="artist-module-nav">
            <NavLink to="/organizer/search-artists">Search Artists</NavLink>
            <NavLink to="/organizer/add-artist-lead">Add Artist Lead</NavLink>
            <NavLink to="/organizer/send-inquiry">Send Inquiry</NavLink>
            <NavLink to="/organizer/inquiry-responses">Inquiry Responses</NavLink>
            <NavLink to="/organizer/send-invitation">Send Invitation</NavLink>
            <NavLink to="/organizer/invitation-tracker">Invitation Tracker</NavLink>
            <NavLink to="/organizer/vote-results">Vote Results</NavLink>
            <NavLink to="/organizer/finalize-artist">Finalize Artist</NavLink>
            <NavLink to="/organizer/calendar-status">Calendar Status</NavLink>
            <NavLink to="/organizer/history-logs">History Logs</NavLink>
          </nav>

          <div className="artist-module-section-title">Artist</div>
          <nav className="artist-module-nav">
            <NavLink to="/artist/inquiries">My Inquiries</NavLink>
            <NavLink to="/artist/invitations">My Invitations</NavLink>
            <NavLink to="/artist/calendar">My Calendar</NavLink>
          </nav>

          <div className="artist-module-section-title">Student</div>
          <nav className="artist-module-nav">
            <NavLink to="/student/artist-shortlist">Artist Shortlist</NavLink>
            <NavLink to="/student/vote-artist">Vote Artist</NavLink>
          </nav>
        </aside>

        <main className="artist-module-main">
          <div className="artist-module-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export default ArtistModuleLayout;