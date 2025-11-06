import {
  AppWindowIcon,
  ArrowDownZA,
  ArrowDownZAIcon,
  ChartPie,
  ChevronRight,
  CircleGaugeIcon,
  CogIcon,
  Menu,
  NotebookTabs,
  Package,
  PackageCheckIcon,
  Settings,
  ShoppingCart,
  ShoppingCartIcon,
  UserCheck,
  UserCog2Icon,
  Users,
  X,
} from "lucide-react";

import Image from "../../assets/bishwajit-1.jpg";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const size = 15;

const SideNavBar = ({ role }) => {
  const [open, setOpen] = useState(false);

  const links = {
    "super-admin": [
      {
        path: "/super-admin",
        label: "Dashboard",
        icon: <CircleGaugeIcon size={size} />,
      },
      {
        path: "/super-admin/profile",
        label: "Profile",
        icon: <UserCheck size={size} />,
      },
      {
        path: "/super-admin/user-management",
        label: "User Management",
        icon: <UserCog2Icon size={size} />,
      },
      {
        path: "/super-admin/vendor-management",
        label: "Vendor Management",
        icon: <UserCog2Icon size={size} />,
      },
      {
        path: "/super-admin/feature-management",
        label: "Feature Management",
        icon: <UserCog2Icon size={size} />,
      },
      {
        path: "/super-admin/plan-management",
        label: "Plan Management",
        icon: <UserCog2Icon size={size} />,
      },
      {
        path: "/super-admin/plan-history-management",
        label: "Plan History",
        icon: <UserCog2Icon size={size} />,
      },
      {
        path: "/super-admin/reports-analytics-management",
        label: "Analytics Management",
        icon: <ChartPie size={size} />,
      },
      {
        path: "/super-admin/system-settings-management",
        label: "Settings Management",
        icon: <Settings size={size} />,
      },
      {
        path: "/super-admin/security-audit-log-management",
        label: "Sec Aud Log Management",
        icon: <AppWindowIcon size={size} />,
      },
      {
        path: "/super-admin/category-management",
        label: "Category Management",
        icon: <ArrowDownZA size={size} />,
      },
      {
        path: "/super-admin/sub-category-management",
        label: "Sub-category Management",
        icon: <ArrowDownZAIcon size={size} />,
      },
      {
        path: "/super-admin/permission-management",
        label: "Permission Management",
        icon: <CogIcon size={size} />,
      },
      {
        path: "/super-admin/role-management",
        label: "Role Management",
        icon: <CogIcon size={size} />,
      },
      {
        path: "/super-admin/cart-management",
        label: "Cart Management",
        icon: <ShoppingCartIcon size={size} />,
      },
      {
        path: "/super-admin/orders-overview-management",
        label: "Orders Management",
        icon: <ShoppingCart size={size} />,
      },
      {
        path: "/super-admin/product-management",
        label: "Product Management",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/project-progress-tracker",
        label: "Product Progress",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/hero-banner-management",
        label: "Hero & Banner",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/announcement-management",
        label: "Announcement",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/developer-journey-tracker",
        label: "Dev Journey Tracker",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/faq-management",
        label: "Faq Management",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/about-content-management",
        label: "About Management",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/developer-portfolio-management",
        label: "Portfolio Management",
        icon: <Package size={size} />,
      },
      {
        path: "/super-admin/project-management",
        label: "Project Management",
        icon: <Package size={size} />,
      },

      // ...more
    ],
    admin: [
      {
        path: "/admin",
        label: "Dashboard",
        icon: <CircleGaugeIcon size={size} />,
      },
      {
        path: "/admin/admin-orders-management",
        label: "Manage Orders",
        icon: <ShoppingCart size={size} />,
      },
      {
        path: "/admin/admin-users-management",
        label: "Manage Users",
        icon: <Users size={size} />,
      },

      // ...more
    ],
    user: [
      { path: "/user", label: "Home" },
      { path: "/user/orders", label: "My Orders" },
      { path: "/user/profile", label: "My Profile" },
      // ...more
    ],
  };
  return (
    <div className="">
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 border border-base-300 left-4 p-2 bg-base-200 text-base-content rounded lg:mt-0 mt-8 lg:ml-0 -ml-4 w-svw"
      >
        <Menu size={24} />
      </button>

      {/* Dark backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-base-200 text-base-content px- shadow-lg transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex justify-between items-center space-x-6 lg:py-3 py-4 lg:px-3 px-3 border-b border-base-300 lg:mt-0 mt-10 bg-base-200 shadow">
          <h1 className="lg:text-2xl text-xl font-bold w-full">Nova Cart</h1>
          <img src={Image} alt="" className="w-8 h-8 rounded-full" />
          {/* Close button for mobile */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-base-content hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="text-base-content overflow-y-auto max-h-[calc(100vh-58px)] lg:py-4 px-2">
          <ul className="lg:space-y-2 space-y-2">
            {links[role]?.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === `/${role}`}
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-base-content border-l-4 border-l-base-content border-b-base-content/25 block border border-t-0 border-r-0 transition-all ease-in duration-300 pl-1 m-0 py-1 text-sm shadow-xs rounded-xs"
                      : "text-base-content hover:text-blue-500 pl-2 m-0 p-0 flex items-center hover:bg-base-300 hover:py-1 hover-border hover:border-base-content/15 justify-between space-x-1 text-sm rounded-xs py-1"
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center space-x-2 justify-between w-full">
                    <span className="flex items-center space-x-2">
                      <span>{link.icon}</span> <span>{link.label}</span>
                    </span>

                    <span>
                      <ChevronRight size={size} />
                    </span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideNavBar;
