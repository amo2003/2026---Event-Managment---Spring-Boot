import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/app.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/form.css";
import "./styles/table.css";
import "./styles/detail.css";
import "./styles/auth.css";
import "./styles/public.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);