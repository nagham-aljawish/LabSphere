import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import Navbar from "../components/shared/Navbar";
import TechnicianNotificationBell from "../components/technician/notifications/TechnicianNotificationBell";

const technicianNavItems = [
  { label: "Home", path: "/technician" },
  { label: "Scan", path: "/technician/scansample" },
  { label: "Tracking", path: "/technician/sampletracking" },
  { label: "Analysis", path: "/technician/labanalysis" },
  { label: "Result", path: "/technician/resultentry" },
  { label: "Review&Submit", path: "/technician/reviewsubmit" },
];

const TechnicianLayout = () => {
  return (
    <>
      <ScrollToTop />

      <Navbar
        navItems={technicianNavItems}
        homePath="/technician"
        notification={<TechnicianNotificationBell />}
      />

      <main className="min-h-screen bg-[#D7E4E9] pt-24">
        <Outlet />
      </main>
    </>
  );
};

export default TechnicianLayout;
