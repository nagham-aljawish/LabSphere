import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const PublicLayout = () => {
  return (
    <>  
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
