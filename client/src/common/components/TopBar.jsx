import { FaPortrait, FaSign, FaSignOutAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";

import Image from "../../assets/bishwajit-1.jpg";
import Logo from "./ui/Logo";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";

const TopBar = ({ role }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/super-admin", label: "Dashboard" },
    { path: "/super-admin/user-management", label: "Users" },
    {
      path: "/super-admin/product-oversight-management",
      label: "Products",
    },
    {
      path: "/super-admin/orders-overview-management",
      label: "Orders",
    },
    {
      path: "/super-admin/system-settings-management",
      label: "Settings",
    },
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
    { path: "/about", label: "About" },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Log out failed", error);
    }
  };

  const NavItems = ({ onClick }) =>
    navLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) =>
          isActive
            ? "font-semibold text-primary"
            : "hover:text-primary transition"
        }
        onClick={onClick}
      >
        {link.label}
      </NavLink>
    ));

  return (
    <header className="sticky top-0 bg-base-200 text-base-content shadow border-b border-base-content/5 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          {role && <span className="text-sm opacity-70">{role}</span>}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <NavItems />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <img
                src={Image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 p-2 bg-base-100 rounded-box shadow space-y-2"
            >
              {isAuthenticated ? (
                <>
                  <li>
                    <button onClick={handleLogout} className="p-0">
                      <FaSignOutAlt size={15} className="text-red-500" /> Log
                      out
                    </button>
                  </li>
                  <li className="text-xs">👤{user.name}</li>
                  <li className="text-xs">{user.email}</li>
                </>
              ) : (
                <li>
                  <Link to="/login">
                    <FaSign size={15} className="text-green-500" /> Login
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/super-admin/developer-portfolio-management"
                  className="p-0"
                >
                  <FaPortrait size={15} /> Portfolio
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-4 pb-4">
          <NavItems onClick={() => setMenuOpen(false)} />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 pl-0"
              >
                <FaSignOutAlt /> <span>Log out</span>
              </button>
              <p className="text-xs -ml-1">👤{user.name}</p>
              <p className="text-xs ml-0">{user.email}</p>
            </>
          ) : (
            <Link to="/login" className="flex items-center space-x-2">
              <FaSign /> <span>Login</span>
            </Link>
          )}
          <Link to="/portfolio" className="flex items-center space-x-2">
            <FaPortrait /> <span>Portfolio</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default TopBar;
