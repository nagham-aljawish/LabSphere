import { Outlet } from "react-router-dom";

import AuthSessionHandler from "../components/auth/AuthSessionHandler";

const RootLayout = () => {
  return (
    <>
      <AuthSessionHandler />
      <Outlet />
    </>
  );
};

export default RootLayout;
