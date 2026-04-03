import React from "react";
import { Link, NavLink } from "react-router-dom";
const PublicNavbar = () => (
  <header className="rm-public-navbar">
    <div>
      <Link to="/r" className="rm-brand-title">SMART RISK</Link>
      <p className="rm-brand-subtitle">Event Safety Portal</p>
    </div>
    <nav className="rm-public-nav-links">
      <NavLink to="/r">Home</NavLink>
      <NavLink to="/rreport-incident">Report</NavLink>
      <NavLink to="/rtrack-incident">Track</NavLink>
      <NavLink to="/rlogin" className="rm-nav-portal-btn">Officer Portal</NavLink>
    </nav>
  </header>
);
export default PublicNavbar;
