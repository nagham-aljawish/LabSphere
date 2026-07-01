import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import ScrollToTop from "../components/shared/ScrollToTop";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  useEffect(() => {
    const { documentElement: html, body } = document;
    const root = document.getElementById("root");

    html.style.backgroundColor = "#D7E4E9";
    body.style.backgroundColor = "#D7E4E9";
    body.style.minHeight = "100dvh";

    if (root) {
      root.style.backgroundColor = "#D7E4E9";
      root.style.minHeight = "100dvh";
    }

    return () => {
      html.style.backgroundColor = "";
      body.style.backgroundColor = "";
      body.style.minHeight = "";

      if (root) {
        root.style.backgroundColor = "";
        root.style.minHeight = "";
      }
    };
  }, []);

  return (
    <>
      <ScrollToTop />

      <div className="min-h-dvh bg-[#D7E4E9] lg:pl-64">
        <AdminSidebar />

        <main className="min-h-dvh pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
