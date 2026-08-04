import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";
import PatientNotificationBell from "../components/patient/notifications/PatientNotificationBell";

const patientNavItems = [
  { label: "Home", path: "/home" },
  { label: "Services", path: "/home/services" },
  { label: "About Us", path: "/home/about" },
  { label: "Contact", path: "/home/contact" },
];

const quickLinks = [
  { title: "Home", path: "/home" },
  { title: "About", path: "/about" },
  { title: "Services", path: "/services" },
  { title: "Contact", path: "/contact" },
  { title: "Login", path: "/login" },
];

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <Navbar
        navItems={patientNavItems}
        homePath="/home"
        notification={<PatientNotificationBell />}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer quickLinks={quickLinks} />
    </div>
  );
};

export default PublicLayout;
