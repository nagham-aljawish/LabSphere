import ReceptionistLayout from "../layouts/ReceptionistLayout";
import ReceptionistHomePage from "../pages/receptionist/ReceptionistHomePage";
import PatientsPage from "../pages/receptionist/PatientsPage";
import RegisterPatientPage from "../pages/receptionist/RegisterPatientPage";
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
    ],
  },
];
