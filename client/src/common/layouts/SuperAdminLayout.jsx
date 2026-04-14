import { Outlet, useLocation } from "react-router-dom";

import DashboardTitle from "../utils/dashboardTitle/DashboardTitle";
import Footer from "../components/Footer";
import { LucideIcon } from "../lib/LucideIcons";
import SideNavBar from "../components/SideNavBar";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";

const SuperAdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isRootAdmin = location.pathname === "/super-admin";
  const formatPathName = (pathname = "") => {
    return (
      pathname
        .split("?")[0] // remove query params
        .split("#")[0] // remove hash
        .replace(/-/g, " ") // hyphens → spaces
        .trim()
        .split("/")
        .filter(Boolean) // remove empty parts
        .pop() // last segment
        ?.replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → spaces
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Dashboard"
    );
  };

  let page = formatPathName(location.pathname);

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-12 lg:max-w-full mx-auto">
        <div className="lg:col-span-2 col-span-12 bg-base-300 text-base-content sticky top-0 lg:max-h-[calc(100vh-0px)] z-50">
          <SideNavBar role="super-admin" />
        </div>
        <main className="lg:col-span-10 col-span-12 lg:border-l-[4px] lg:border-base-content/5">
          <div className="sticky top-0 z-50">
            <TopBar role="super-admin" />
          </div>
          <div className="invisible lg:visible sticky top-[56px] z-40">
            <DashboardTitle
              decoratedText={user?.name}
              icon={<LucideIcon.CircleGauge />}
              location={isRootAdmin ? "Dashboard" : page}
            />
          </div>
          <div className="lg:min-h-[calc(100vh-200px)] lg:p-4 p-2 bg-base-200 shadow">
            <Outlet />
          </div>
          <div className="text-base-content mt-10">
            <Footer role="super-admin" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
