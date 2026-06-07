import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";

const PublicLayout = () => {
  return (
    <>  
    <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
