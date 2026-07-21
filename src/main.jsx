import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import keycloak from "./auth/keycloak";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

keycloak
  .init({
    onLoad: "check-sso",
    pkceMethod: "S256",
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <AuthProvider>
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      </AuthProvider>,
    );
  })
  .catch((err) => {
    console.error("Keycloak initialization failed:", err);
  });
