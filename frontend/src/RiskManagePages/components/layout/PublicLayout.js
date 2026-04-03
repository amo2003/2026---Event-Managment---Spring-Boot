import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
const PublicLayout = () => (
  <div className="rm-public-shell">
    <div className="rm-public-overlay" />
    <PublicNavbar />
    <main className="rm-public-main"><Outlet /></main>
  </div>
);
export default PublicLayout;
