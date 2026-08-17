import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";
import DoctorNotificationBell from "../components/doctor/notifications/DoctorNotificationBell";
import { DoctorNotificationsProvider } from "../context/DoctorNotificationsContext";

const doctorNavItems = [
  { label: "Dashboard", path: "/doctor" },
  { label: "Pending Reviews", path: "/doctor/results" },
];

const doctorQuickLinks = [
  { title: "Dashboard", path: "/doctor" },
  { title: "Pending Reviews", path: "/doctor/results" },
];

const DoctorLayout = () => {
  return (
    <DoctorNotificationsProvider>
      <div className="flex min-h-dvh w-full flex-col bg-[#D7E4E9]">
        <ScrollToTop />

        <Navbar
          navItems={doctorNavItems}
          homePath="/doctor"
          notification={<DoctorNotificationBell />}
        />

        <main className="w-full flex-1 bg-[#D7E4E9] pt-24">
          <Outlet />
        </main>

        <Footer quickLinks={doctorQuickLinks} />
      </div>
    </DoctorNotificationsProvider>
  );
};

export default DoctorLayout;
