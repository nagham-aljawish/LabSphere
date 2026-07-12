import TechnicianLayout from "../layouts/TechnicianLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import TechnicianHomePage from "../pages/technician/TechnicianHomePage";
import TechnicianNotificationsPage from "../pages/technician/TechnicianNotificationPage";
import TechnicianScanPage from "../pages/technician/TechnicianScanPage";
import TechnicianSampleTrackingPage from "../pages/technician/TechnicianSampleTrackingPage";
import TechnicianLabAnalysisPage from "../pages/technician/TechnicianLabAnalysisPage";

export const technicianRoutes = [
  {
    path: "/technician",
    element: <ProtectedRoute allowedRoles={["technician"]} />,
    children: [
      {
        element: <TechnicianLayout />,
        children: [
          {
            index: true,
            element: <TechnicianHomePage />,
          },
          {
            path: "notifications",
            element: <TechnicianNotificationsPage />,
          },
          {
            path: "scansample",
            element: <TechnicianScanPage />,
          },
          {
            path: "sampletracking",
            element: <TechnicianSampleTrackingPage />,
          },
          {
            path: "labanalysis",
            element: <TechnicianLabAnalysisPage />,
          },
        ],
      },
    ],
  },
];
