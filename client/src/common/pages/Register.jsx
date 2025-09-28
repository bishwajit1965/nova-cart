import { Eye, EyeOff, Loader } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFacebookAccessToken, initFacebookSDK } from "../lib/facebookSdk";
import { getGoogleIdToken, initializeGoogleSDK } from "../lib/googleSdk";
import { useCallback, useEffect } from "react";

import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { LucideIcon } from "../lib/LucideIcons";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import useValidator from "../hooks/useValidator";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register, setUser, setIsAuthenticated } = useAuth();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  console.log("Form data", form);
  console.log("Accepted terms", form.acceptedTerms);

  const validationRules = {
    name: {
      required: { message: "Name is required" },
      minLength: { value: 2, message: "Name must be at least 2 characters" },
      pattern: {
        value: /^[a-zA-Z\s\-']+$/,
        message: "Name can only contain letters and spaces",
      },
    },
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
        // Regex requires at least one lowercase, uppercase, digit, special char (. - included)
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^.-])[A-Za-z\d@$!%*?#&^.-]{6,}$/,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },
    confirmPassword: {
      required: { message: "Please confirm your password" },
      custom: (value, formData) =>
        value !== formData.password ? "Passwords do not match" : null,
    },
  };

  const { errors, validate } = useValidator(validationRules, form);
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
    initializeGoogleSDK();
  }, []);

  useEffect(() => {
    initFacebookSDK();
  }, []);

  const handleRegister = useCallback(
    async (e, method) => {
      if (method === "email") e.preventDefault();

      setActiveMethod(method);
      setLoading(true);

      const resetLoading = () => {
        setLoading(false);
        setActiveMethod(null);
      };
      if (!form.acceptedTerms) {
        toast.error("Please accept the terms and conditions.");
        resetLoading();
        return;
      }

      try {
        switch (method) {
          case "email": {
            if (!validate()) {
              resetLoading();
              return;
            }
            if (form.password !== form.confirmPassword) {
              toast.error("Passwords do not match");
              resetLoading();
              return;
            }
            await register(form);
            toast.success("Registration is successful!");
            break;
          }

          case "google": {
            const { user, accessToken } = await getGoogleIdToken();
            if (!user || !accessToken) throw new Error("Google sign-up failed");

            setUser(user);
            setIsAuthenticated(true);
            toast.success("Registered with Google");
            break;
          }

          case "facebook": {
            const token = await getFacebookAccessToken();
            if (!token) throw new Error("Facebook access token not received");

            const res = await api.post("/auth/oauth/facebook-signup", {
              token,
            });
            const user = res?.data?.user;
            if (!user) throw new Error("Facebook sign-up failed");

            setUser(user);
            setIsAuthenticated(true);
            toast.success("Registered with Facebook");
            break;
          }

          default:
            throw new Error("Invalid registration method");
        }

        navigate(from, { replace: true });
        setIsError(false);
        setMessage("✅ Login successful!");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      } catch (err) {
        console.error("Signup error:", err);
        const msg =
          err === "User skipped"
            ? "You cancelled the Google/Facebook sign-up."
            : err === "Prompt not displayed"
            ? "OAuth prompt could not be displayed."
            : err.response?.data?.message || err.message || "Sign-up failed.";
        toast.error(msg);
      } finally {
        setTimeout(resetLoading, 2000);
      }
    },
    [
      form,
      from,
      // acceptedTerms,
      navigate,
      register,
      setIsAuthenticated,
      validate,
      setUser,
    ]
  );

  return (
    <div className="lg:max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow space-y-2">
      <div className="flex items-center justify-center space-x-2 lg:mb-5">
        <Logo />{" "}
        <span className="lg:text-2xl text-xl lg:font-extrabold text-indigo-600">
          REGISTER
        </span>
      </div>
      <form
        onSubmit={(e) => handleRegister(e, "email")}
        className="lg:space-y-3 space-y-2"
      >
        <div className="">
          <Input
            type="text"
            name="name"
            value={form?.name}
            icon={LucideIcon.User}
            placeholder="Full Name..."
            onChange={handleChange}
            className={`${
              errors.name ? "input-error bg-yellow-100" : ""
            } input input-sm input-bordered w-full`}
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div className="">
          <Input
            type="email"
            icon={LucideIcon.Mail}
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form?.email}
            className={`${
              errors.email ? "input-error bg-yellow-100" : ""
            } input input-sm input-bordered w-full`}
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <Input
            name="password"
            value={form?.password}
            icon={LucideIcon.Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Password..."
            onChange={handleChange}
            className={`${
              errors.password ? "input-error bg-yellow-100" : ""
            } input input-sm input-bordered w-full`}
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
        <div className="relative">
          <Input
            name="confirmPassword"
            value={form?.confirmPassword}
            icon={LucideIcon.Lock}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password..."
            onChange={handleChange}
            className={`${
              errors.confirmPassword ? "input-error bg-yellow-100" : ""
            } input input-sm input-bordered w-full`}
          />
          <span
            className="absolute right-2 top-1 cursor-pointer z-50"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="text-gray-300" />
            ) : (
              <Eye className="text-gray-300" />
            )}
          </span>
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary"
              id="terms"
              value={form.acceptedTerms}
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={(e) =>
                setForm({ ...form, acceptedTerms: e.target.checked })
              }
            />
            <span className="text-indigo">
              <Link
                to="/terms"
                className="text-blue-600 underline text-xs"
                target="_blank"
              >
                I agree to the terms
              </Link>
            </span>
          </div>

          <div className="">
            <Button
              onClick={(e) => handleRegister(e, "email")}
              type="submit"
              disabled={activeMethod === "email"}
              variant="primary"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded btn btn-primary flex items-center ${
                activeMethod === "email" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {activeMethod === "email" ? (
                <Loader className="animate-spin" />
              ) : (
                <LucideIcon.Users size={15} />
              )}
              {activeMethod === "email" ? "Registering..." : " Register"}{" "}
            </Button>
          </div>
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
      <div className="w-full lg:space-y-2 space-y-2">
        <div className="">
          <Button
            onClick={() => handleRegister(null, "facebook")}
            disabled={loading && activeMethod === "facebook"}
            variant="primary"
            className="w-full"
          >
            <FaFacebook /> Register with Facebook
          </Button>
        </div>
        <div className="w-full">
          <Button
            onClick={() => handleRegister(null, "google")}
            disabled={loading && activeMethod === "google"}
            variant="danger"
            className="w-full"
          >
            <FaGoogle /> Register with Google
          </Button>
        </div>
      </div>
      <p className="text-sm text-center">
        Already have an account ?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in here
        </Link>
      </p>
      <div className="divider m-0 p-0"></div>
      <p className="mt-2 text-center text-xs text-base-content/60">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-indigo-500 font-bold">Nova Cart</span> . All
        rights reserved. <script></script>
      </p>
    </div>
  );
};

export default Register;
