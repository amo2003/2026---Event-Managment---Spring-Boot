import React from "react";
import { Link, NavLink } from "react-router-dom";
const PublicNavbar = () => (
  <header className="rm-public-navbar">
    <div>
      <Link to="/" className="rm-brand-title">SMART RISK</Link>
      <p className="rm-brand-subtitle">Event Safety Portal</p>
    </div>
    <nav className="rm-public-nav-links">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/report-incident">Report</NavLink>
      <NavLink to="/track-incident">Track</NavLink>
      <NavLink to="/login" className="rm-nav-portal-btn">Officer Portal</NavLink>
    </nav>
  </header>
);
export default PublicNavbar;
