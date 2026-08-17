import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api, { getToken, setUnauthorizedHandler } from "../../services/api";
import { subscribeToAuthSession } from "../../services/session";

const AuthSessionHandler = () => {
  const { clearSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const expiringRef = useRef(false);
  const hadActiveSessionRef = useRef(false);

  const redirectToLogin = useCallback(
    (fromActiveSession: boolean) => {
      clearSession();
      hadActiveSessionRef.current = false;
      navigate("/login", {
        replace: true,
        state: fromActiveSession ? { sessionExpired: true } : undefined,
      });
    },
    [clearSession, navigate],
  );

  const expireSession = useCallback(async () => {
    if (expiringRef.current) {
      return;
    }

    expiringRef.current = true;
    const fromActiveSession = hadActiveSessionRef.current;
    const token = getToken();

    try {
      if (token) {
        await api.post("/auth/logout", null, { skipAuthRedirect: true });
      }
    } catch {
      // Token may already be expired on the server.
    } finally {
      redirectToLogin(fromActiveSession);
    }
  }, [redirectToLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      expiringRef.current = false;
      hadActiveSessionRef.current = true;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      redirectToLogin(hadActiveSessionRef.current);
    });

    return () => setUnauthorizedHandler(null);
  }, [redirectToLogin]);

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    return subscribeToAuthSession(() => {
      void expireSession();
    });
  }, [expireSession, isAuthenticated]);

  return null;
};

export default AuthSessionHandler;
