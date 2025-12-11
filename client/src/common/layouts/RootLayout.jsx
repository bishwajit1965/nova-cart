import { Outlet } from "react-router-dom";
import PublicFooter from "../components/publicUis/PublicFooter";
import PublicNavBar from "../components/publicUis/PublicNavBar";
import { useState } from "react";
import CartDrawer from "../components/cartDrawer/CartDrawer";

const RootLayout = () => {
  const [openCart, setOpenCart] = useState(false);
  return (
    <div className="min-h-screen max-w-full flex-column text-base-content/70">
      <div className="bg-base-200 sticky top-0 z-50">
        <PublicNavBar />
      </div>

      <main className="lg:min-h-[calc(100vh-80px)] lg:py-12 py-6 lg:max-w-7xl mx-auto lg:px-2 px-2 text-base-content/70">
        <Outlet />
        {/* Global Cart Drawer */}
        <CartDrawer isOpen={openCart} onClose={() => setOpenCart(false)} />
      </main>

      <div className="bg-base-200 text-base-content/70 z-50">
        <PublicFooter />
      </div>
    </div>
  );
};

export default RootLayout;
