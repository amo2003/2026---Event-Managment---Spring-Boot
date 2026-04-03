import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/rlogin" replace state={{ from: location }} />;
  }

  if (user?.mustChangePassword && location.pathname !== "/rchange-password") {
    return <Navigate to="/rchange-password" replace />;
  }

  return children;
};

export default ProtectedRoute;