import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { authUser } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Smart Risk</h2>
        <p>Operations Portal</p>
      </div>

      <div className="sidebar-section-label">Navigation</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Incident List
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Alerts
        </NavLink>

        {authUser?.role === "ADMIN" && (
          <NavLink
            to="/officers"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Officer Management
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;