import { Outlet } from "react-router-dom";
import PublicFooter from "../components/publicUis/PublicFooter";
import PublicNavBar from "../components/publicUis/PublicNavBar";

const RootLayout = () => {
  return (
    <div className="min-h-screen max-w-full flex-column text-base-content/70">
      <div className="bg-base-200 sticky top-0 z-50">
        <PublicNavBar />
      </div>

      <main className="lg:min-h-[calc(100vh-80px)] lg:py-6 py-3 text-base-content/70 lg:px-0 px-2">
        <Outlet />
      </main>

      <div className="bg-base-200 text-base-content/70 z-50">
        <PublicFooter />
      </div>
    </div>
  );
};

export default RootLayout;
