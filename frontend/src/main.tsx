import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { PatientNotificationsProvider } from "./context/PatientNotificationsContext";
import { router } from "./routes/AppRoutes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <PatientNotificationsProvider>
        <RouterProvider router={router} />
      </PatientNotificationsProvider>
    </AuthProvider>
  </StrictMode>,
);
