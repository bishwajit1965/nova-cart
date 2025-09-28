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
  const formatPathName = (pathname) => {
    return pathname
      .replace(/-/g, " ") // hyphens → spaces
      .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space before capital letters
      .split(" ") // split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
      .join(" ");
  };

  let page = formatPathName(location.pathname.trim().split("/").pop());

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-12 lg:max-w-full mx-auto">
        <div className="lg:col-span-2 col-span-12 bg-base-200 text-base-content sticky top-0 lg:max-h-[calc(100vh-0px)] z-50">
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
              location={page}
            />
          </div>
          <div className="lg:min-h-[calc(100vh-150px)] lg:p-6 p-4 bg-base-200">
            <Outlet />
          </div>
          <div className="text-base-content">
            <Footer role="super-admin" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
