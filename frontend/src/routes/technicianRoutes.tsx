import TechnicianLayout from "../layouts/TechnicianLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import TechnicianHomePage from "../pages/technician/TechnicianHomePage";

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
      
        ],
      },
    ],
  },
];
