import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="public-shell">
      <div className="public-overlay" />
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;