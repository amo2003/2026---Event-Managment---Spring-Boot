import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="rm-topbar">
      <div className="rm-topbar-copy">
        <h1>OPERATIONS</h1>
        <p>Live incident response workspace</p>
      </div>
      <div className="rm-topbar-right">
        <div className="rm-user-chip">
          <strong>{user?.fullName || "Officer"}</strong>
          <span>{user?.role || "OFFICER"}</span>
        </div>
        <button className="rm-btn rm-btn-ghost" onClick={() => { logout(); navigate("/rlogin"); }}>Logout</button>
      </div>
    </header>
  );
};
export default Topbar;
