import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Smart Risk & Incident Management</h1>
        <p className="topbar-subtitle">
          University Event Safety Operations Dashboard
        </p>
      </div>

      <div className="topbar-right">
        <div className="user-chip">
          <strong>{authUser?.fullName || "User"}</strong>
          <span>{authUser?.role || "OFFICER"}</span>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;