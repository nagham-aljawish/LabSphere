import ReceptionistLayout from "../layouts/ReceptionistLayout";
import ReceptionistHomePage from "../pages/receptionist/ReceptionistHomePage";
import PatientsPage from "../pages/receptionist/PatientsPage";
import RegisterPatientPage from "../pages/receptionist/RegisterPatientPage";
import RequestsPage from "../pages/receptionist/RequestsPage";
import CreateRequestPage from "../pages/receptionist/CreateRequestPage";
import PatientProfilePage from "../pages/receptionist/PatientProfilePage";
import RequestQRPage from "../pages/receptionist/RequestQRPage";
import PaymentPage from "../pages/receptionist/PaymentPage";
import NotificationsPage from "../pages/receptionist/NotificationsPage";

export const receptionistRoutes = [
  {
    path: "/receptionist",
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
];
