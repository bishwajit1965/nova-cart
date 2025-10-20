import { ArrowDown, Menu, Moon, Sun, X } from "lucide-react";
import { FaPortrait, FaSign, FaSignOutAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";

import Avatar from "../../../assets/Avatar.png";
import Image from "../../../assets/bishwajit-1.jpg";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import useSystemSettings from "../../hooks/useSystemSettings";
import { useTheme } from "../../hooks/useTheme";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// import Logo from "../ui/Logo";

const PublicNavBar = () => {
  const { systemSettings } = useSystemSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/client-cart-management", label: "Shop" },
    { path: "/client-product-wishlist", label: "Wishlist" },
    { path: "/client-specific-orders", label: "Orders" },
    { path: "/product-categories", label: "Categories" },
    { path: "/contact-us", label: "Contact" },
    { path: "/about-us", label: "About" },
    { path: "/my-profile", label: "Portfolio" },
    { path: "/client-plan-subscription", label: "Plan" },
  ];
  console.log("System settings in Public navbar", systemSettings);
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Log out failed", error);
    }
  };

  return (
    <header className="bg-base-200 shadow-md">
      <div className="max-w-7xl mx-auto px-2 lg:py-0 py-2 flex items-center justify-between">
        {/* Site Logo */}
        <Link to="/" className="lg:text-xl font-bold text-primary">
          <img
            src={`${apiURL}/uploads/${systemSettings?.logo}`}
            alt={systemSettings?.appName || "Nova Cart"}
            className="w-36 object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 items-center text-base-content">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-blue-600 border-blue-600 transition ease-in duration-300 pl-2"
                  : "text-base-content hover:text-blue-500 transition pl-2"
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar-end">
            <div className="flex justify-end p-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-800" />
                )}
              </button>
            </div>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <ArrowDown />

                <img
                  src={`${isAuthenticated ? Image : Avatar}`}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow text-base-content"
              >
                {isAuthenticated && user ? (
                  <li className="text-base-content text-xl">
                    <a onClick={handleLogout} className="text-[16px]">
                      <FaSignOutAlt /> Log out
                    </a>
                  </li>
                ) : (
                  <li className="text-base-content text-xl">
                    <a href="/login" className="text-[16px]">
                      <FaSign /> Login
                    </a>
                  </li>
                )}
                <li className="text-base-content text-xl">
                  <a href="/my-portfolio" className="text-[16px]">
                    <FaPortrait />
                    Portfolio
                  </a>
                </li>
                <li className="text-base-content text-sm">
                  <a href="/my-portfolio">{user?.name}</a>
                </li>
                <li className="text-base-content text-sm">
                  <a href="/my-portfolio">{user?.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-base-content"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden grid bg-base-200 text-base-content px-2 pb-2 space-y-2 shadow-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-blue-600 border-blue-600 transition ease-in duration-300 pl-2"
                  : "text-base-content hover:text-blue-500 transition pl-2"
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar-start grid">
            <div className="grid justify-start p-">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-base-content"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-800" />
                )}
              </button>
            </div>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <ArrowDown />

                <img src={Image} alt="" className="w-10 h-10 rounded-full" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 ml-0 shadow text-xl"
              >
                {isAuthenticated && user ? (
                  <li className="text-base-content text-xl">
                    <a onClick={handleLogout} className="text-[16px]">
                      <FaSignOutAlt /> Log out
                    </a>
                  </li>
                ) : (
                  <li className="text-base-content text-xl">
                    <a href="/login" className="text-[16px]">
                      <FaSign /> Login
                    </a>
                  </li>
                )}
                <li className="text-base-content text-xl">
                  <a href="/my-portfolio" className="text-[16px]">
                    <FaPortrait />
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="/portfolio">{user.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavBar;
