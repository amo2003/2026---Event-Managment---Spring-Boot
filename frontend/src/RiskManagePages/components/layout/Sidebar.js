import React from "react";
import { NavLink } from "react-router-dom";
const Sidebar = () => (
  <aside className="rm-sidebar">
    <div className="rm-sidebar-brand">
      <h2>SMART RISK</h2>
      <p>Officer Console</p>
    </div>
    <nav className="rm-sidebar-nav">
      <span className="rm-sidebar-section">Menu</span>
      <NavLink to="/rdashboard">Dashboard</NavLink>
      <NavLink to="/rincidents">Incidents</NavLink>
      <NavLink to="/ralerts">Alerts</NavLink>
    </nav>
  </aside>
);
export default Sidebar;
