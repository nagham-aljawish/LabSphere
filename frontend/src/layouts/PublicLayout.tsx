import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";
import { quickLinks } from "../data/footerData";
import { patientNavItems } from "../data/navbarData";

const PublicLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar
        navItems={patientNavItems}
        homePath="/home"
        rightContent={
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="rounded-xl border border-[#052836] px-5 py-2 font-medium text-[#052836] hover:bg-[#052836] hover:text-[#D7E4E9]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl border border-[#052836] bg-[#052836] px-5 py-2 font-medium text-white transition hover:bg-[#D7E4E9] hover:text-[#052836]"
            >
              Sign Up
            </Link>
          </div>
        }
      />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer quickLinks={quickLinks} />
    </>
  );
};

export default PublicLayout;