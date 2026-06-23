import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";

import Footer from "../components/shared/Footer";
import { receptionistQuickLinks } from "../data/footerData";
import Navbar from "../components/shared/Navbar";
import { receptionistNavItems } from "../data/navbarData";

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
