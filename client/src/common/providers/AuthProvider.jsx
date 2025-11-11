import { useEffect, useState } from "react";

import AuthContext from "../context/authContext";
import api from "../lib/api";
import toast from "react-hot-toast";
// import { initializeGoogleSDK } from "../lib/googleSdk.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Refresh session
        const res = await api.get("/auth/refresh", {
          withCredentials: true, // ✅ must include cookies
        });
        const newAccessToken = res.data.accessToken;

        // after you get accessToken from refresh or localStorage
        if (newAccessToken) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          localStorage.setItem("accessToken", newAccessToken);
        }

        // 2) ✅ Fetch full user with plan + features
        const me = await api.get("/auth/me", { withCredentials: true });

        setUser(me.data);
        setIsAuthenticated(true);

        console.log("✅ Full user loaded:", me.data);

        // ⬇️ Attach token to Axios instance
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // setUser(res.data.user);
        console.log("✅ Session refreshed:", res.data.user);
        setIsAuthenticated(true);
        toast.success("🔒 Session restored"); // ✅ Toast on success
      } catch (err) {
        const storedUser =
          JSON.parse(localStorage.getItem("user")) ||
          JSON.parse(sessionStorage.getItem("user"));
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          toast.success("Session restored from storage");
        } else {
          setUser(null);
          setIsAuthenticated(false);
          toast.error("⚠️ Session expired, please log in again");
          console.log("Error found", err);
        }
      } finally {
        setAuthReady(true);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async ({ name, email, password }, rememberMe = false) => {
    const res = await api.post(
      "/auth/register",
      { name, email, password },
      { withCredentials: true }
    );
    const user = res.data?.user;
    if (!user) {
      throw new Error("Registration failed. Please check your credentials.");
    }
    // ⬇️ Attach token to Axios instance
    setUser(user);
    setIsAuthenticated(true);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(user));
    return user;
  };

  const login = async (email, password, rememberMe = false) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    const user = res.data?.user;
    if (!user) {
      throw new Error("Login failed. Please check your credentials.");
    }
    // ⬇️ Attach token to Axios instance
    setUser(user);
    setIsAuthenticated(true);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(user));
    return user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  const authInfo = {
    user,
    isAuthenticated,
    loading,
    authReady,
    setUser,
    setIsAuthenticated,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
