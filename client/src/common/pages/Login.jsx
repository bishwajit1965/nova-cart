import { Eye, EyeOff, LoaderCircle, LogInIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { LucideIcon } from "../lib/LucideIcons";
import { useAuth } from "../hooks/useAuth";
import useValidator from "../hooks/useValidator";
import GoogleSignInButton from "../components/googleAuthButton/GoogleSignInButton";
import toast from "react-hot-toast";

import FacebookSignInButton from "../components/facebookAuthButton/FacebookSignInButton";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const { login, setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const formData = { email, password };
  const validationRules = {
    email: {
      required: { message: "Email is required" },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email",
      },
    },
    password: {
      required: { message: "Password is required" },
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  };
  const { errors, validate } = useValidator(validationRules, formData);

  // Email login handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setActiveMethod("email");
    try {
      const loggedInUser = await login(email, password, rememberMe);
      setUser(loggedInUser);
      setIsAuthenticated(true);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(loggedInUser));

      const userRoles = (loggedInUser.roles || []).map((r) =>
        (typeof r === "string" ? r : r.name).toLowerCase()
      );
      const from = location.state?.from?.pathname;
      const redirectTo = from
        ? from
        : userRoles.includes("super-admin")
        ? "/super-admin"
        : userRoles.includes("admin")
        ? "/admin"
        : "/";
      navigate(redirectTo, { replace: true });
      toast.success("Login successful!");
    } catch (err) {
      setIsError(true);
      const msg = err.response?.data?.message || err.message || "Login failed";
      setMessage(msg);
      toast.error(msg);
    } finally {
      setActiveMethod(null);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Callback for GoogleSignInButton
  const handleGoogleSuccess = (user, accessToken, refreshToken) => {
    setUser(user);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const userRoles = (user.roles || []).map((r) =>
      (typeof r === "string" ? r : r.name).toLowerCase()
    );
    const redirectTo = userRoles.includes("super-admin")
      ? "/super-admin"
      : userRoles.includes("admin")
      ? "/admin"
      : "/";
    navigate(redirectTo, { replace: true });
    toast.success("Logged in with Google!");
  };

  return (
    <div className="lg:max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow-sm space-y-2 border border-base-content/15">
      <div className="flex items-center justify-center space-x-2 lg:mb-5">
        <Logo />
        <span className="lg:text-2xl text-xl lg:font-extrabold text-indigo-600">
          LOGIN
        </span>
      </div>

      <form className="lg:space-y-3 space-y-2">
        <Input
          type="text"
          icon={LucideIcon.Mail}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${
            errors.email ? "input-error bg-yellow-100" : ""
          } input input-sm input-bordered w-full`}
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email}</p>
        )}

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            icon={LucideIcon.Lock}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex justify-between items-center">
          <label className="label text-indigo-500 text-xs flex items-center gap-1">
            <input
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>

          <Button
            onClick={handleEmailLogin}
            type="button"
            disabled={activeMethod === "email"}
            className="px-2"
          >
            {activeMethod === "email" ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <LogInIcon size={20} />
            )}
            {activeMethod === "email" ? "Logging In..." : "Log In"}
          </Button>
        </div>

        {message && (
          <p
            className={`mt-2 text-center text-sm ${
              isError ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="divider">OR</div>

      {/* Google + Facebook Login/Signup */}
      <div className="flex flex-col gap-2">
        <GoogleSignInButton onLoginSuccess={handleGoogleSuccess} />

        <FacebookSignInButton />
      </div>

      <p className="text-center text-sm mt-4">
        Forgot password ?{" "}
        <Link to="/forgot-password" className="text-blue-600 underline text-sm">
          Reset here
        </Link>
      </p>
      <p className="text-center text-sm">
        New to this site ?{" "}
        <Link to="/register" className="text-blue-600 underline text-sm">
          Register
        </Link>
      </p>
      <div className="divider m-0 p-0"></div>
      <p className="mt-2 text-center text-xs text-base-content/60">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-indigo-500 font-bold">Nova Cart</span> . All
        rights reserved.
      </p>
    </div>
  );
};

export default Login;

// import { Eye, EyeOff, Loader, LoaderCircle } from "lucide-react";
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";

// import { useState } from "react";

// import Button from "../components/ui/Button";
// import { Input } from "../components/ui/Input";
// import Logo from "../components/ui/Logo";
// import { LucideIcon } from "../lib/LucideIcons";
// import api from "../lib/api";
// import toast from "react-hot-toast";
// import { useAuth } from "../hooks/useAuth";
// import useValidator from "../hooks/useValidator";
// import GoogleSignInButton from "../components/googleAuthButton/GoogleSignInButton";
// // import GoogleSignInButton from "../components/googleAuthButton/GoogleSignInButton";

// const Login = () => {
//   const { login, setUser, setIsAuthenticated } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [activeMethod, setActiveMethod] = useState(null);
//   const [rememberMe, setRememberMe] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Validation Rules
//   const formData = { email, password };

//   // Validation Rules
//   const validationRules = {
//     email: {
//       required: { message: "Email is required" },
//       pattern: {
//         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//         message: "Enter a valid email address",
//       },
//     },
//     password: {
//       required: { message: "Password is required" },
//       minLength: {
//         value: 6,
//         message: "Password must be at least 6 characters",
//       },
//       pattern: {
//         value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?#&^]).{6,}$/,
//         message:
//           "Password must include uppercase, lowercase, number, and special character",
//       },
//     },
//   };
//   const { errors, validate } = useValidator(validationRules, formData);

//   const handleGoogleSuccess = (user, accessToken, refreshToken) => {
//     setUser(user);
//     setIsAuthenticated(true);

//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);

//     const userRoles = (user.roles || [])
//       .map((r) => (typeof r === "string" ? r : r.name))
//       .map((r) => r.toLowerCase());

//     let redirectTo = "/";
//     if (userRoles.includes("super-admin")) redirectTo = "/super-admin";
//     else if (userRoles.includes("admin")) redirectTo = "/admin";

//     navigate(redirectTo, { replace: true });
//   };

//   /*** ------> Login handler ------> */
//   // const handleLogin = async (event, method, oauthCredential = null) => {
//   //   if (method === "email") event.preventDefault();
//   //   setActiveMethod(method);
//   //   setLoading(true);

//   //   const resetLoading = () => {
//   //     setLoading(false);
//   //     setActiveMethod(null);
//   //   };

//   //   try {
//   //     let loggedInUser = null;

//   //     // Fetch user depending on login method
//   //     switch (method) {
//   //       case "email": {
//   //         if (!validate()) {
//   //           resetLoading();
//   //           return;
//   //         }
//   //         loggedInUser = await login(email, password, rememberMe);
//   //         break;
//   //       }

//   //       case "google": {
//   //         if (!oauthCredential) throw new Error("Google credential missing");
//   //         const res = await axios.post(
//   //           `${import.meta.env.VITE_API_URL}/api/auth/google`,
//   //           { credential: oauthCredential },
//   //           { withCredentials: true }
//   //         );
//   //         loggedInUser = res?.data?.user;
//   //         console.log("Logged in user", loggedInUser);
//   //         break;
//   //       }

//   //       case "facebook": {
//   //         if (!oauthCredential) throw new Error("Facebook token missing");
//   //         const res = await api.post(
//   //           "/auth/oauth/facebook",
//   //           { token: oauthCredential },
//   //           { withCredentials: true }
//   //         );
//   //         loggedInUser = res?.data?.user;
//   //         break;
//   //       }

//   //       default:
//   //         throw new Error("Invalid login method");
//   //     }

//   //     if (!loggedInUser) throw new Error("User not returned from login");

//   //     // ✅ Update state & store
//   //     setUser(loggedInUser);
//   //     setIsAuthenticated(true);
//   //     toast.success("Login successful!");

//   //     const storage = rememberMe ? localStorage : sessionStorage;
//   //     storage.setItem("user", JSON.stringify(loggedInUser));

//   //     // ✅ Prepare roles
//   //     const userRoles = (loggedInUser.roles || [])
//   //       .map((r) => (typeof r === "string" ? r : r.name))
//   //       .map((r) => r.toLowerCase());

//   //     // ✅ Redirect logic
//   //     const from = location.state?.from?.pathname;
//   //     const redirectTo = from
//   //       ? from
//   //       : userRoles.includes("super-admin")
//   //       ? "/super-admin"
//   //       : userRoles.includes("admin")
//   //       ? "/admin"
//   //       : "/";

//   //     navigate(redirectTo, { replace: true });

//   //     setIsError(false);
//   //     setMessage("✅ Login successful!");
//   //   } catch (error) {
//   //     console.error("Login error", error);
//   //     setIsError(true);
//   //     const errMsg =
//   //       error.response?.data?.message ||
//   //       error.message ||
//   //       "Login failed. Try again.";
//   //     setMessage(errMsg);
//   //     toast.error(errMsg);
//   //   } finally {
//   //     setTimeout(() => {
//   //       resetLoading();
//   //       setMessage("");
//   //     }, 2000);
//   //   }
//   // };

//   const handleLogin = async (event, method) => {
//     if (method === "email") event.preventDefault();
//     setActiveMethod(method);
//     setLoading(true);

//     const resetLoading = () => {
//       setLoading(false);
//       setActiveMethod(null);
//     };

//     let loggedInUser = null;

//     try {
//       switch (method) {
//         case "email": {
//           if (!validate()) {
//             resetLoading();
//             return;
//           }

//           loggedInUser = await login(email, password, rememberMe);
//           console.log("Logged in user:", loggedInUser);
//           break;
//         }

//         case "google": {
//           alert("Clicked");
//           const { credential } = response; // GIS sends credential
//           const res = await axios.post(
//             `${import.meta.env.VITE_API_URL}/api/auth/google`,
//             { credential }
//           );
//           console.log("Response", res);

//           // Save tokens
//           localStorage.setItem("accessToken", res.data.accessToken);
//           localStorage.setItem("refreshToken", res.data.refreshToken);
//           localStorage.setItem("user", JSON.stringify(res.data.user));

//           toast.success("Logged in with Google!");

//           loggedInUser = res?.data?.user;
//           break;
//         }

//         case "facebook": {
//           const token = await getFacebookAccessToken();
//           if (!token) {
//             resetLoading();
//             return;
//           }

//           const res = await api.post("/auth/oauth/facebook", { token });
//           loggedInUser = res?.data?.user;
//           break;
//         }

//         default:
//           throw new Error("Invalid login method");
//       }

//       if (!loggedInUser) throw new Error("User not returned from login");

//       if (loggedInUser) {
//         setUser(loggedInUser);
//         setIsAuthenticated(true);
//         toast.success("Login is successful!");
//         // Store user in localStorage or sessionStorage based on rememberMe
//         const storage = rememberMe ? localStorage : sessionStorage;
//         storage.setItem("user", JSON.stringify(loggedInUser));

//         // Role names lowercase
//         const userRoles = (loggedInUser.roles || [])
//           .map((r) => (typeof r === "string" ? r : r.name))
//           .map((r) => r.toLowerCase());

//         let redirectTo;
//         const from = location.state?.from?.pathname;

//         // If user tried to access a protected page before login
//         if (from) {
//           redirectTo = from;
//         } else {
//           // Role-based landing
//           if (userRoles.includes("super-admin")) redirectTo = "/super-admin";
//           else if (userRoles.includes("admin")) redirectTo = "/admin";
//           else if (userRoles.includes("user")) redirectTo = "/";
//           else redirectTo = "/";
//         }

//         navigate(redirectTo, { replace: true });

//         setIsError(false);
//         setMessage("✅ Login successful!");
//       } else {
//         throw new Error("User not returned from login");
//       }
//     } catch (error) {
//       console.error("Login error", error);
//       setIsError(true);
//       const errMsg =
//         error.response?.data?.message || "Login failed. Try again.";
//       setMessage(errMsg);
//       toast.error(errMsg);
//     } finally {
//       setTimeout(() => {
//         resetLoading();
//         setMessage("");
//       }, 2000);
//     }
//   };

//   return (
//     <div className="lg:max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow space-y-2">
//       <div className="flex items-center justify-center space-x-2 lg:mb-5">
//         <Logo />{" "}
//         <span className="lg:text-2xl text-xl lg:font-extrabold text-indigo-600">
//           LOGIN
//         </span>
//       </div>
//       <form action="" className="lg:space-y-3 space-y-2">
//         <div className="">
//           <Input
//             type="text"
//             icon={LucideIcon.Mail}
//             name="email"
//             className={`${
//               errors.email ? "input-error bg-yellow-100" : ""
//             } input input-sm input-bordered w-full`}
//             placeholder="Enter your email address..."
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           {errors.email && (
//             <p className="text-red-600 text-xs mt-1">{errors.email}</p>
//           )}
//         </div>
//         <div className="relative">
//           <Input
//             type={showPassword ? "text" : "password"}
//             icon={LucideIcon.Lock}
//             name="password"
//             className={`${
//               errors.password ? "input-error bg-yellow-100" : ""
//             } input input-sm input-bordered w-full`}
//             placeholder="Password..."
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <span
//             className="absolute right-2 top-1 cursor-pointer z-50"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? (
//               <EyeOff className="text-gray-300" />
//             ) : (
//               <Eye className="text-gray-300" />
//             )}
//           </span>
//           {errors.password && (
//             <p className="text-red-600 text-xs mt-1">{errors.password}</p>
//           )}
//         </div>

//         <div className="flex justify-between">
//           <div className="flex items-center space-x-1">
//             <label className="label text-indigo-500 text-xs">
//               <input
//                 type="checkbox"
//                 className="checkbox checkbox-xs checkbox-primary"
//                 name=""
//                 id=""
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               Remember me
//             </label>
//           </div>
//           <Button
//             onClick={(e) => handleLogin(e, "email")}
//             type="button"
//             disabled={activeMethod === "email"}
//             variant="primary"
//             className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded btn btn-primary flex items-center ${
//               activeMethod === "email" ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {activeMethod === "email" ? (
//               <LoaderCircle className="animate-spin" />
//             ) : (
//               <LucideIcon.Users />
//             )}
//             {activeMethod === "email" ? "Logging In ..." : " Log In"}{" "}
//           </Button>
//         </div>
//         <div className="justify-between">
//           <div className="">
//             {message && (
//               <p
//                 className={`mt-4 text-center text-sm ${
//                   isError ? "text-red-500" : "text-green-600"
//                 } transition-all`}
//               >
//                 {message}
//               </p>
//             )}
//           </div>
//         </div>
//       </form>
//       <div className="divider p-0 my-2">OR</div>
//       <div className="w-full lg:space-y-3 space-y-2">
//         <div className="block">
//           <Button
//             variant="primary"
//             className="w-full"
//             onClick={(e) => handleLogin(e, "facebook")}
//             disabled={activeMethod === "facebook"}
//           >
//             {activeMethod === "facebook" ? (
//               <Loader className="animate-spin" />
//             ) : (
//               <FaFacebook />
//             )}
//             {activeMethod === "facebook"
//               ? "Logging In ..."
//               : " Log In with Facebook"}
//           </Button>
//         </div>
//         <div className="w-full flex flex-col gap-2">
//           <button
//             type="button"
//             onClick={() => handleLogin(null, "google")}
//             disabled={activeMethod === "google"}
//             className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 ${
//               activeMethod === "google" ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {activeMethod === "google" ? (
//               <>
//                 <Loader className="animate-spin" /> Logging in...
//               </>
//             ) : (
//               <>
//                 <FaGoogle /> Login with Google
//               </>
//             )}
//           </button>
//           {activeMethod === "google" && (
//             <GoogleSignInButton
//               onSuccess={handleLogin}
//               onStart={() => setActiveMethod("google")}
//               onFinish={() => setActiveMethod(null)}
//             />
//           )}
//           <GoogleSignInButton />
//         </div>

//         {/* <div className="w-full flex flex-col gap-2">
//           <button
//             type="button"
//             onClick={() => handleLogin(null, "google")}
//             disabled={activeMethod === "google"}
//             className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 ${
//               activeMethod === "google" ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {activeMethod === "google" ? (
//               <>
//                 <Loader className="animate-spin" /> Logging in...
//               </>
//             ) : (
//               <>
//                 <FaGoogle /> Login with Google
//               </>
//             )}
//           </button>

//           <div
//             style={{ display: activeMethod === "google" ? "block" : "none" }}
//           >
//             <GoogleSignInButton
//               onLoginSuccess={handleGoogleSuccess}
//               onStart={() => setActiveMethod("google")}
//               onFinish={() => setActiveMethod(null)}
//             />
//           </div>
//         </div> */}

//         {/* <div className="block">
//           <GoogleSignInButton
//             // onLoginSuccess={handleGoogleSuccess}
//             onClick={() => handleLogin(null, "google")}
//             className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center ${
//               activeMethod === "google" ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//             disabled={activeMethod === "google"}
//           >
//             {activeMethod === "google" ? (
//               <>
//                 <Loader className="animate-spin mr-2" />
//                 Logging In...
//               </>
//             ) : (
//               <>
//                 <FaGoogle className="mr-2" />
//                 Log in with Google
//               </>
//             )}
//           </GoogleSignInButton>
//         </div> */}

//         {/* <div className="block">
//           <Button
//             type="submit"
//             onClick={(e) => handleLogin(null, "google")}
//             disabled={activeMethod === "google"}
//             variant="danger"
//             className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded btn btn-primary flex items-center  ${
//               activeMethod === "google" ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {activeMethod === "google" ? (
//               <Loader className="animate-spin" />
//             ) : (
//               <FaGoogle />
//             )}
//             {activeMethod === "google"
//               ? "Logging In ..."
//               : "  Log in with Google"}
//             <GoogleSignInButton useOneTap auto_select={false} />
//           </Button>
//         </div> */}
//       </div>
//       <div className="space-y-2">
//         <p className="text-sm text-center">
//           <span className="mr-1 text-sm">Forgot password ?</span>
//           <Link
//             to="/forgot-password"
//             className="text-blue-600 underline text-sm"
//           >
//             Reset password here
//           </Link>
//         </p>
//         <p className="text-sm text-center">
//           New to this site ?{" "}
//           <Link to="/register" className="text-blue-600 underline text-sm">
//             Register here
//           </Link>
//         </p>
//         <div className="divider m-0 p-0"></div>
//         <p className="mt-2 text-center text-xs text-base-content/60">
//           &copy; {new Date().getFullYear()}{" "}
//           <span className="text-indigo-500 font-bold">Nova Cart</span> . All
//           rights reserved. <script></script>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
