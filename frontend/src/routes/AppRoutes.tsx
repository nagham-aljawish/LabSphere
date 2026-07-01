import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import PublicLayout from "../layouts/PublicLayout";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleDashboardPage from "../pages/dashboard/RoleDashboardPage";
import Splash from "../pages/Splash";
import About from "../pages/patient/About";
import Contact from "../pages/patient/Contact";
import DonationPage from "../pages/patient/DonationPage";
import FinancialAidPage from "../pages/patient/FinancialAidPage";
import Home from "../pages/patient/Home";
import PaymentPage from "../pages/patient/PaymentPage";
import ResultDetailsPage from "../pages/patient/ResultDetailsPage";
import ResultsPage from "../pages/patient/ResultsPage";
import Services from "../pages/patient/Services";
import PatientNotificationsPage from "../pages/patient/PatientNotificationsPage";
import TestsPage from "../pages/patient/TestsPage";
import { receptionistRoutes } from "./receptionistRoutes";
import { adminRoutes } from "./adminRoutes";
import { technicianRoutes } from "./technicianRoutes";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Splash />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      {
        path: "/home",
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "services",
            element: <Services />,
          },
          {
            path: "contact",
            element: <Contact />,
          },
          {
            element: <ProtectedRoute allowedRoles={["patient"]} />,
            children: [
              {
                path: "results",
                element: <ResultsPage />,
              },
              {
                path: "results/:id",
                element: <ResultDetailsPage />,
              },
              {
                path: "tests",
                element: <TestsPage />,
              },
              {
                path: "payment",
                element: <PaymentPage />,
              },
              {
                path: "donate",
                element: <DonationPage />,
              },
              {
                path: "financial-aid",
                element: <FinancialAidPage />,
              },
              {
                path: "notifications",
                element: <PatientNotificationsPage />,
              },
            ],
          },
        ],
      },
      ...adminRoutes,
      {
        path: "/doctor",
        element: <ProtectedRoute allowedRoles={["doctor"]} />,
        children: [
          {
            element: <PublicLayout />,
            children: [
              {
                index: true,
                element: (
                  <RoleDashboardPage
                    title="Doctor Dashboard"
                    description="Review and approve laboratory results."
                  />
                ),
              },
            ],
          },
        ],
      },
      ...technicianRoutes,
      ...receptionistRoutes,
    ],
  },
]);
