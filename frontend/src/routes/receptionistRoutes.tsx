import ReceptionistLayout from "../layouts/ReceptionistLayout";
import ReceptionistHomePage from "../pages/receptionist/ReceptionistHomePage";
import PatientsPage from "../pages/receptionist/PatientsPage";
import RegisterPatientPage from "../pages/receptionist/RegisterPatientPage";
import RequestsPage from "../pages/receptionist/RequestsPage";
import CreateRequestPage from "../pages/receptionist/CreateRequestPage";
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
         path:"/receptionist/patients/:patientId/request",
         element:<CreateRequestPage />,
      }
    ],
  },
];
