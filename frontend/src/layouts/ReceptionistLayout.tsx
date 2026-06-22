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

      <Navbar
        navItems={receptionistNavItems}
        homePath="/receptionist"
        rightContent={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-[#052836]">Receptionist</p>

              <p className="text-sm text-gray-500">LabSphere Portal</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#052836] font-semibold text-white">
              R
            </div>
          </div>
        }
      />

      <main className="pt-24">
        <Outlet />
      </main>

      <Footer quickLinks={receptionistQuickLinks} />
    </>
  );
};

export default ReceptionistLayout;