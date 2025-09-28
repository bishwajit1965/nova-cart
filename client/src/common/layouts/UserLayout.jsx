import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import TopBar from "../components/TopBar";

const UserLayout = () => {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-12 lg:max-w-full mx-auto">
        <div className="lg:col-span-2 col-span-12 bg-base-200 text-base-content sticky top-0 overflow-y-scroll lg:max-h-[calc(100vh-0px)]">
          <SideNavBar role="user" />
        </div>
        <main className="lg:col-span-10 col-span-12 lg:border-base-300 lg:border-l-2">
          <TopBar role="user" />
          <div className="lg:min-h-[calc(100vh-84px)] p-4">
            <Outlet />
          </div>
          <div className="bg-base-200 text-base-content">
            <Footer role="user" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
