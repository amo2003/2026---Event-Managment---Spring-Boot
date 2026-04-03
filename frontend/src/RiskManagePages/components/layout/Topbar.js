import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-copy">
        <h1>OPERATIONS</h1>
        <p>Live incident response workspace</p>
      </div>

      <div className="topbar-right">
        <div className="user-chip">
          <strong>{user?.fullName || "Officer"}</strong>
          <span>{user?.role || "OFFICER"}</span>
        </div>

        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;