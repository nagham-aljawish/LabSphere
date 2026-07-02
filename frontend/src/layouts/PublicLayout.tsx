import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";

import Footer from "../components/shared/Footer";

import ScrollToTop from "../components/shared/ScrollToTop";

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
    <>
      <ScrollToTop />

      <Navbar navItems={patientNavItems} homePath="/home" />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer quickLinks={quickLinks} />
    </>
  );
};

export default PublicLayout;
