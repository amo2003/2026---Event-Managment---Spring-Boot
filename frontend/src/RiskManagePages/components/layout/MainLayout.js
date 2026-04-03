import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
const MainLayout = () => (
  <div className="rm-app-shell">
    <Sidebar />
    <div className="rm-content-shell">
      <Topbar />
      <main className="rm-content-main"><Outlet /></main>
    </div>
  </div>
);
export default MainLayout;
