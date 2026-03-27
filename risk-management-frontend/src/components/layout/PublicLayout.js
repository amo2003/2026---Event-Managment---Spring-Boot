import PublicNavbar from "./PublicNavbar";

function PublicLayout({ children }) {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <main className="public-main">{children}</main>
    </div>
  );
}

export default PublicLayout;