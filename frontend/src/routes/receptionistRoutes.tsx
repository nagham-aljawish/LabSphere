import ReceptionistLayout from "../layouts/ReceptionistLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import CreateRequestPage from "../pages/receptionist/CreateRequestPage";
import NotificationsPage from "../pages/receptionist/NotificationsPage";
import PatientProfilePage from "../pages/receptionist/PatientProfilePage";
import PatientsPage from "../pages/receptionist/PatientsPage";
import PaymentPage from "../pages/receptionist/PaymentPage";
import ReceptionistHomePage from "../pages/receptionist/ReceptionistHomePage";
import RegisterPatientPage from "../pages/receptionist/RegisterPatientPage";
import RequestQRPage from "../pages/receptionist/RequestQRPage";
import RequestsPage from "../pages/receptionist/RequestsPage";

export const receptionistRoutes = [
  {
    path: "/receptionist",
    element: <ProtectedRoute allowedRoles={["reception"]} />,
    children: [
      {
        element: <ReceptionistLayout />,
        children: [
          {
            index: true,
            element: <ReceptionistHomePage />,
          },
          {
            path: "patients",
            element: <PatientsPage />,
          },
          {
            path: "patients/register",
            element: <RegisterPatientPage />,
          },
          {
            path: "requests",
            element: <RequestsPage />,
          },
          {
            path: "patients/:patientId/request",
            element: <CreateRequestPage />,
          },
          {
            path: "patients/:patientId",
            element: <PatientProfilePage />,
          },
          {
            path: "patients/:patientId/request/qr",
            element: <RequestQRPage />,
          },
          {
            path: "payments/:patientId",
            element: <PaymentPage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
        ],
      },
    ],
  },
];
