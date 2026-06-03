import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const PublicLayout = () => {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;