import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import Navbar from "../components/shared/Navbar";

const technicianNavItems = [
  { label: "Orders", path: "/technician" },
];

const TechnicianLayout = () => {
  return (
    <>
      <ScrollToTop />

      <Navbar navItems={technicianNavItems} homePath="/technician" />

      <main className="min-h-screen bg-[#D7E4E9] pt-24">
        <Outlet />
      </main>
    </>
  );
};

export default TechnicianLayout;
