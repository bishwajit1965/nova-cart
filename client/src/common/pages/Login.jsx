import { Eye, EyeOff, Loader, LoaderCircle } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFacebookAccessToken, initFacebookSDK } from "../lib/facebookSdk";
import { getGoogleIdToken, initializeGoogleSDK } from "../lib/googleSdk";
import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { LucideIcon } from "../lib/LucideIcons";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import useValidator from "../hooks/useValidator";

const Login = () => {
  const { login, setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Validation Rules
  const formData = { email, password };

  useEffect(() => {
    initializeGoogleSDK();
  }, []);

  useEffect(() => {
    initFacebookSDK();
  }, []);

  // Validation Rules
  const validationRules = {
    email: {
      required: { message: "Email is required" },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },
    password: {
      required: { message: "Password is required" },
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?#&^]).{6,}$/,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },
  };
  const { errors, validate } = useValidator(validationRules, formData);

  const handleLogin = async (event, method) => {
    if (method === "email") event.preventDefault();
    setActiveMethod(method);
    setLoading(true);

    const resetLoading = () => {
      setLoading(false);
      setActiveMethod(null);
    };

    let loggedInUser = null;

    try {
      switch (method) {
        case "email": {
          if (!validate()) {
            resetLoading();
            return;
          }

          loggedInUser = await login(email, password, rememberMe);
          console.log("Logged in user:", loggedInUser);
          break;
        }

        case "google": {
          const token = await getGoogleIdToken();
          if (!token) {
            resetLoading();
            return;
          }

          const res = await api.post("/auth/oauth/google", { token });
          loggedInUser = res?.data?.user;
          break;
        }

        case "facebook": {
          const token = await getFacebookAccessToken();
          if (!token) {
            resetLoading();
            return;
          }

          const res = await api.post("/auth/oauth/facebook", { token });
          loggedInUser = res?.data?.user;
          break;
        }

        default:
          throw new Error("Invalid login method");
      }

      if (!loggedInUser) throw new Error("User not returned from login");

      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        toast.success("Login is successful!");
        // Store user in localStorage or sessionStorage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(loggedInUser));

        // Role names lowercase
        const userRoles = (loggedInUser.roles || [])
          .map((r) => (typeof r === "string" ? r : r.name))
          .map((r) => r.toLowerCase());

        let redirectTo;
        const from = location.state?.from?.pathname;

        // If user tried to access a protected page before login
        if (from) {
          redirectTo = from;
        } else {
          // Role-based landing
          if (userRoles.includes("super-admin")) redirectTo = "/super-admin";
          else if (userRoles.includes("admin")) redirectTo = "/admin";
          else if (userRoles.includes("user")) redirectTo = "/";
          else redirectTo = "/";
        }

        navigate(redirectTo, { replace: true });

        setIsError(false);
        setMessage("✅ Login successful!");
      } else {
        throw new Error("User not returned from login");
      }
    } catch (error) {
      console.error("Login error", error);
      setIsError(true);
      const errMsg =
        error.response?.data?.message || "Login failed. Try again.";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setTimeout(() => {
        resetLoading();
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="lg:max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow space-y-2">
      <div className="flex items-center justify-center space-x-2 lg:mb-5">
        <Logo />{" "}
        <span className="lg:text-2xl text-xl lg:font-extrabold text-indigo-600">
          LOGIN
        </span>
      </div>
      <form action="" className="lg:space-y-3 space-y-2">
        <div className="">
          <Input
            type="text"
            icon={LucideIcon.Mail}
            name="email"
            className={`${
              errors.email ? "input-error bg-yellow-100" : ""
            } input input-sm input-bordered w-full`}
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            icon={LucideIcon.Lock}
            name="password"
            className={`${
              errors.password ? "input-error bg-yellow-100" : ""
            } input input-sm input-bordered w-full`}
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-2 top-1 cursor-pointer z-50"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="text-gray-300" />
            ) : (
              <Eye className="text-gray-300" />
            )}
          </span>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            <label className="label text-indigo-500 text-xs">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary"
                name=""
                id=""
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
          </div>
          <Button
            onClick={(e) => handleLogin(e, "email")}
            type="button"
            disabled={activeMethod === "email"}
            variant="primary"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded btn btn-primary flex items-center ${
              activeMethod === "email" ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {activeMethod === "email" ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <LucideIcon.Users />
            )}
            {activeMethod === "email" ? "Logging In ..." : " Log In"}{" "}
          </Button>
        </div>
        <div className="justify-between">
          <div className="">
            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  isError ? "text-red-500" : "text-green-600"
                } transition-all`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="divider p-0 my-2">OR</div>
      <div className="w-full lg:space-y-3 space-y-2">
        <div className="block">
          <Button
            variant="primary"
            className="w-full"
            onClick={(e) => handleLogin(e, "facebook")}
            disabled={activeMethod === "facebook"}
          >
            {activeMethod === "facebook" ? (
              <Loader className="animate-spin" />
            ) : (
              <FaFacebook />
            )}
            {activeMethod === "facebook"
              ? "Logging In ..."
              : " Log In with Facebook"}
          </Button>
        </div>
        <div className="block">
          <Button
            type="submit"
            onClick={(e) => handleLogin(e, "google")}
            disabled={activeMethod === "google"}
            variant="danger"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded btn btn-primary flex items-center  ${
              activeMethod === "google" ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {activeMethod === "google" ? (
              <Loader className="animate-spin" />
            ) : (
              <FaGoogle />
            )}
            {activeMethod === "google"
              ? "Logging In ..."
              : "  Log in with Google"}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-center">
          <span className="mr-1 text-sm">Forgot password ?</span>
          <Link
            to="/forgot-password"
            className="text-blue-600 underline text-sm"
          >
            Reset password here
          </Link>
        </p>
        <p className="text-sm text-center">
          New to this site ?{" "}
          <Link to="/register" className="text-blue-600 underline text-sm">
            Register here
          </Link>
        </p>
        <div className="divider m-0 p-0"></div>
        <p className="mt-2 text-center text-xs text-base-content/60">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-indigo-500 font-bold">Nova Cart</span> . All
          rights reserved. <script></script>
        </p>
      </div>
    </div>
  );
};

export default Login;
