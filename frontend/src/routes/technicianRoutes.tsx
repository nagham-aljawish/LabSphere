import TechnicianLayout from "../layouts/TechnicianLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import TechnicianOrdersPage from "../pages/technician/TechnicianOrdersPage";
import TechnicianOrderPage from "../pages/technician/TechnicianOrderPage";

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
            element: <TechnicianOrdersPage />,
          },
          {
            path: "orders/:orderId",
            element: <TechnicianOrderPage />,
          },
        ],
      },
    ],
  },
];
