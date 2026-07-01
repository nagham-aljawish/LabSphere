import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setUnauthorizedHandler } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AuthSessionHandler = () => {
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate("/login", { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession, navigate]);

  return null;
};

export default AuthSessionHandler;
