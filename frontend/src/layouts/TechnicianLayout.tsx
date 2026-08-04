import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import Navbar from "../components/shared/Navbar";

import { TechnicianNotificationsProvider } from "../context/TechnicianNotificationsContext";
import { TechnicianTrackingProvider } from "../context/TechnicianTrackingContext";

import TechnicianNotificationBell from "../components/technician/notifications/TechnicianNotificationBell";
import Footer from "../components/shared/Footer";

const technicianNavItems = [
  { label: "Home", path: "/technician" },
  { label: "Tracking", path: "/technician/sampletracking" },
  { label: "Scan", path: "/technician/scansample" },
];

const technicianQuickLinks = [
  { title: "Home", path: "/technician" },
  { title: "Tracking", path: "/technician/sampletracking" },
  { title: "Scan", path: "/technician/scansample" },
];

const TechnicianLayout = () => {
  return (
    <TechnicianNotificationsProvider>
      <TechnicianTrackingProvider>
        <div className="flex min-h-screen flex-col">
          <ScrollToTop />

          <Navbar
            navItems={technicianNavItems}
            homePath="/technician"
            notification={<TechnicianNotificationBell />}
          />

          <main className="flex-1 bg-[#D7E4E9] pt-24">
            <Outlet />
          </main>

          <Footer quickLinks={technicianQuickLinks} />
        </div>
      </TechnicianTrackingProvider>
    </TechnicianNotificationsProvider>
  );
};

export default TechnicianLayout;
