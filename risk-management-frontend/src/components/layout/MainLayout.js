import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-section">
        <Topbar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;