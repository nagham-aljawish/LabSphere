import ReceptionistLayout from "../layouts/ReceptionistLayout";
import ReceptionistHomePage from "../pages/receptionist/ReceptionistHomePage";
import PatientsPage from "../pages/receptionist/PatientsPage";
import RegisterPatientPage from "../pages/receptionist/RegisterPatientPage";
import RequestsPage from "../pages/receptionist/RequestsPage";
import CreateRequestPage from "../pages/receptionist/CreateRequestPage";
import PatientProfilePage from "../pages/receptionist/PatientProfilePage";
import RequestQRPage from "../pages/receptionist/RequestQRPage";

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
    ],
  },
];
