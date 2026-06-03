import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/labsphere_logo_nobg 2.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-[#AEC0C8] flex items-center justify-center">
      <div className="text-center">
        <img src={logo} alt="LabSphere" className="mx-auto w-80 animate-logo" />

        <h1 className="mt-6 text-5xl font-bold text-[#052836]">LabSphere</h1>
      </div>
    </div>
  );
};

export default Splash;
