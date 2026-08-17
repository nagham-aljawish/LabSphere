import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import ReceptionistNotificationBell from "../components/receptionist/notifications/ReceptionistNotificationBell";

const receptionistNavItems = [
  { label: "Home", path: "/receptionist" },
  { label: "Patients", path: "/receptionist/patients" },
  { label: "Requests", path: "/receptionist/requests" },
];

const receptionistQuickLinks = [
  { title: "Home", path: "/receptionist" },
  { title: "Patients", path: "/receptionist/patients" },
  { title: "Requests", path: "/receptionist/requests" },
  { title: "Notifications", path: "/receptionist/notifications" },
];

const ReceptionistLayout = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#D7E4E9]">
      <ScrollToTop />

      <Navbar
        navItems={receptionistNavItems}
        homePath="/receptionist"
        notification={<ReceptionistNotificationBell />}
      />

      <main className="w-full flex-1 bg-[#D7E4E9] pt-24">
        <Outlet />
      </main>

      <Footer quickLinks={receptionistQuickLinks} />
    </div>
  );
};

export default ReceptionistLayout;
