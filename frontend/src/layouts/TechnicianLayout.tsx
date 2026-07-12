import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import Navbar from "../components/shared/Navbar";

import { TechnicianNotificationsProvider } from "../context/TechnicianNotificationsContext";
import { TechnicianTrackingProvider } from "../context/TechnicianTrackingContext";

import TechnicianNotificationBell from "../components/technician/notifications/TechnicianNotificationBell";
import Footer from "../components/shared/Footer";

const technicianNavItems = [
  { label: "Home", path: "/technician" },
  { label: "Scan", path: "/technician/scansample" },
  { label: "Tracking", path: "/technician/sampletracking" },
  { label: "Analysis", path: "/technician/labanalysis" },
  { label: "Result", path: "/technician/resultentry" },
  { label: "Review&Submit", path: "/technician/reviewsubmit" },
];

const technicianQuickLinks = [
  { title: "Home", path: "/technician" },
  { title: "Scan", path: "/technician/scansample" },
  { title: "Tracking", path: "/technician/sampletracking" },
  { title: "Analysis", path: "/technician/labanalysis" },
  { title: "Result", path: "/technician/resultentry" },
  { title: "Review", path: "/technician/reviewsubmit" },
];

const TechnicianLayout = () => {
  return (
    <TechnicianNotificationsProvider>
      <TechnicianTrackingProvider>
        <ScrollToTop />

        <Navbar
          navItems={technicianNavItems}
          homePath="/technician"
          notification={<TechnicianNotificationBell />}
        />

        <main className="min-h-screen bg-[#D7E4E9] pt-24">
          <Outlet />
        </main>

        <Footer quickLinks={technicianQuickLinks} />
      </TechnicianTrackingProvider>
    </TechnicianNotificationsProvider>
  );
};

export default TechnicianLayout;
