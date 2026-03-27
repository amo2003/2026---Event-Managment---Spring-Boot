import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import PublicLayout from "./components/layout/PublicLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import ReportIncidentPage from "./pages/ReportIncidentPage";
import IncidentListPage from "./pages/IncidentListPage";
import OfficerManagementPage from "./pages/OfficerManagementPage";
import AlertPage from "./pages/AlertPage";
import IncidentDetailsPage from "./pages/IncidentDetailsPage";
import LoginPage from "./pages/LoginPage";
import PublicHomePage from "./pages/PublicHomePage";
import TrackIncidentPage from "./pages/TrackIncidentPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <PublicHomePage />
          </PublicLayout>
        }
      />

      <Route
        path="/report-incident"
        element={
          <PublicLayout>
            <ReportIncidentPage />
          </PublicLayout>
        }
      />

      <Route
        path="/track-incident"
        element={
          <PublicLayout>
            <TrackIncidentPage />
          </PublicLayout>
        }
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["OFFICER", "ADMIN"]}>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents"
        element={
          <ProtectedRoute allowedRoles={["OFFICER", "ADMIN"]}>
            <MainLayout>
              <IncidentListPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute allowedRoles={["OFFICER", "ADMIN"]}>
            <MainLayout>
              <IncidentDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute allowedRoles={["OFFICER", "ADMIN"]}>
            <MainLayout>
              <AlertPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/officers"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <OfficerManagementPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;