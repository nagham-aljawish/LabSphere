import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getToken } from "../services";
import { getDashboardPath } from "../utils/roleRoutes";

export function useAuthPageGuard() {
  const { user, loading, isAuthenticated, clearSession, refreshSession } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true });
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    refreshSession()
      .then((currentUser) => {
        if (currentUser) {
          navigate(getDashboardPath(currentUser.role), { replace: true });
        }
      })
      .catch(() => {
        clearSession();
      });
  }, [
    clearSession,
    isAuthenticated,
    loading,
    navigate,
    refreshSession,
    user,
  ]);
}

export default useAuthPageGuard;
