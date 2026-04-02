import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>SMART RISK</h2>
        <p>Officer Console</p>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section">Menu</span>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/incidents">Incidents</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;