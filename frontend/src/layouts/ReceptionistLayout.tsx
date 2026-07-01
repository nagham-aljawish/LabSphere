import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

const receptionistNavItems = [
  { label: "Home", path: "/receptionist" },
  { label: "Patients", path: "/receptionist/patients" },
  { label: "Requests", path: "/receptionist/requests" },
  { label: "Notifications", path: "/receptionist/notifications" },
];

const receptionistQuickLinks = [
  { title: "Home", path: "/receptionist" },
  { title: "Patients", path: "/receptionist/patients" },
  { title: "Requests", path: "/receptionist/requests" },
  { title: "Notifications", path: "/receptionist/notifications" },
];

const ReceptionistLayout = () => {
  return (
    <>
      <ScrollToTop />

      <Navbar navItems={receptionistNavItems} homePath="/receptionist" />

      <main className="pt-24">
        <Outlet />
      </main>

      <Footer quickLinks={receptionistQuickLinks} />
    </>
  );
};

export default ReceptionistLayout;
