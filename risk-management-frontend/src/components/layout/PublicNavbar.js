import { Link, NavLink } from "react-router-dom";

function PublicNavbar() {
  return (
    <header className="public-navbar">
      <div className="public-brand">
        <Link to="/" className="public-brand-link">
          Smart Risk
        </Link>
        <span className="public-brand-subtitle">University Event Safety</span>
      </div>

      <nav className="public-nav-links">
        <NavLink to="/" className="public-nav-link">
          Home
        </NavLink>
        <NavLink to="/report-incident" className="public-nav-link">
          Report Incident
        </NavLink>
        <NavLink to="/track-incident" className="public-nav-link">
          Track Incident
        </NavLink>
        <Link to="/login" className="operations-link-btn">
          Operations Portal
        </Link>
      </nav>
    </header>
  );
}

export default PublicNavbar;