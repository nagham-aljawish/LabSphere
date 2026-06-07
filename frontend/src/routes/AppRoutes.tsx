import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Splash from "../pages/Splash";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/patient/Home";
import About from "../pages/patient/About";
import Services from "../pages/patient/Services";
import Contact from "../pages/patient/Contact";
import ResultsPage from "../pages/patient/ResultsPage";
import ResultDetailsPage from "../pages/patient/ResultDetailsPage";
import TestsPage from "../pages/patient/TestsPage";
import PaymentPage from "../pages/patient/PaymentPage";
import DonationPage from "../pages/patient/DonationPage";
import FinancialAidPage from "../pages/patient/FinancialAidPage";

export const router = createBrowserRouter([
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
        element: <FinancialAidPage />
      }
    ],
  },
]);
