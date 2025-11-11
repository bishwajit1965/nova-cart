import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const GoogleSignInButton = () => {
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { credential },
        { withCredentials: true }
      );

      const user = res.data.user;

      // ✅ Save global auth state
      setUser(user);
      setIsAuthenticated(true);

      // ✅ Save tokens
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ IMPORTANT: attach token immediately
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      // ✅ Role based redirect
      const userRoles = (user.roles || []).map((r) =>
        typeof r === "string" ? r : r.name.toLowerCase()
      );

      const from = location.state?.from?.pathname;
      let redirectTo =
        from ||
        (userRoles.includes("super-admin")
          ? "/super-admin"
          : userRoles.includes("admin")
          ? "/admin"
          : "/");

      navigate(redirectTo, { replace: true });

      toast.success("Logged in with Google!");
    } catch (err) {
      console.log(err);
      toast.error("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Login with Google failed!")}
      useOneTap
      auto_select={false}
    />
  );
};

export default GoogleSignInButton;
