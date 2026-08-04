import TechnicianLayout from "../layouts/TechnicianLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import TechnicianHomePage from "../pages/technician/TechnicianHomePage";
import TechnicianNotificationsPage from "../pages/technician/TechnicianNotificationPage";
import TechnicianScanPage from "../pages/technician/TechnicianScanPage";
import TechnicianSampleTrackingPage from "../pages/technician/TechnicianSampleTrackingPage";
import TechnicianLabAnalysisPage from "../pages/technician/TechnicianLabAnalysisPage";
import TechnicianOrdersPage from "../pages/technician/TechnicianOrdersPage";
import TechnicianOrderPage from "../pages/technician/TechnicianOrderPage";
import TechnicianResultEntryPage from "../pages/technician/TechnicianResultEntryPage";

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
            path: "orders",
            element: <TechnicianOrdersPage />,
          },
          {
            path: "orders/:orderId",
            element: <TechnicianOrderPage />,
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
          {
            path: "resultentry",
            element: <TechnicianResultEntryPage />,
          },
          {
            path: "resultentry/:orderId",
            element: <TechnicianResultEntryPage />,
          },
        ],
      },
    ],
  },
];
