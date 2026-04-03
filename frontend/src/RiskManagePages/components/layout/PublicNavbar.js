import React from "react";
import { Link, NavLink } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <header className="public-navbar">
      <div className="brand-block">
        <Link to="/" className="brand-title">
          SMART RISK
        </Link>
        <p className="brand-subtitle">Event Safety Portal</p>
      </div>

      <nav className="public-nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/report-incident">Report</NavLink>
        <NavLink to="/track-incident">Track</NavLink>
        <NavLink to="/login" className="nav-portal-btn">
          Officer Portal
        </NavLink>
      </nav>
    </header>
  );
};

export default PublicNavbar;