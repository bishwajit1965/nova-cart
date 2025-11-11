import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";

const FacebookSignInButton = () => {
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const responseFacebook = async (response) => {
    try {
      if (!response.accessToken) throw new Error("Facebook login failed");

      const res = await api.post(
        "/auth/facebook",
        { accessToken: response.accessToken },
        { withCredentials: true }
      );

      const user = res.data.user;

      setUser(user);
      setIsAuthenticated(true);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", res.data.accessToken);

      // Role-based redirect
      const userRoles = (user.roles || []).map((r) =>
        typeof r === "string" ? r : r.name.toLowerCase()
      );

      let redirectTo = userRoles.includes("super-admin")
        ? "/super-admin"
        : userRoles.includes("admin")
        ? "/admin"
        : "/";

      navigate(redirectTo, { replace: true });

      toast.success("Logged in with Facebook!");
    } catch (err) {
      console.error(err);
      toast.error("Facebook login failed");
    }
  };

  return (
    <FacebookLogin
      appId={import.meta.env.VITE_FACEBOOK_APP_ID}
      fields="name,email,picture"
      callback={responseFacebook}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <FaFacebook size={20} />
          Sign in with Facebook
        </button>
      )}
    />
  );
};

export default FacebookSignInButton;
